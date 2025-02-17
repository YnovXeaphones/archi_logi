import { home, port } from '../models/indexModel.js';
import { v4 as uuidv4 } from 'uuid';
import Sequelize, { where } from 'sequelize';
import { Op } from 'sequelize';
import yaml from 'js-yaml';


import { InfluxDB } from '@influxdata/influxdb-client'
import { BucketsAPI, OrgsAPI } from '@influxdata/influxdb-client-apis'

export const addPing = async (mac) => {
    try {
        const date = new Date();

        let update = await home.update({ last_ping: date }, { where: { mac: mac } });
        if (update[0] === 0) {
            console.error('Erreur lors de la mise à jour du last_ping: Mac address non trouvé');
            return { code: 404, message: 'Adresse MAC non trouvé' };
        }

        return { code: 200, message: date };
    } catch (error) {
        console.error('Erreur lors de l\'ajout du ping:', error);
        throw error;
    }
};

export const addHome = async (mac, sshkey) => {
    try {
        const date = new Date();

        let exist = await home.findOne({ where: { mac: mac } });
        let homeid = null;

        if (!exist) {
            let create = await home.create({ id: uuidv4(), mac: mac, last_ping: null, datecreated: date, sshkey: sshkey });

            if (!create) {
                console.error('Erreur lors de la création de la maison');
                return { code: 500, message: 'Erreur lors de la création de la maison' };
            }

            homeid = create.id;

            let response = await fetch('http://g1.south-squad.io:7880', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sshkey: sshkey })
            });

            if (!response.ok) {
                console.error('Erreur lors de l\'ajout de la clé SSH');
                return { code: 500, message: 'Erreur lors de l\'ajout de la clé SSH' };
            }
        } else {
            homeid = exist.id;
        }

        let ports = [80];
        let allocatedPorts = [];

        for (let currentPort of ports) {
            let exist = await port.findOne({ where: { homeid: homeid, port: {[Op.like]: `${currentPort}%`} } });
            if (exist) {
                allocatedPorts[currentPort] = exist.port;
                continue;
            }

            exist = true
            let newPort = null;
            while (exist) {
                newPort = parseInt(`${currentPort}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`);
                exist = await port.findOne({ where: { port: newPort } });
            }

            let create = await port.create({ homeid: homeid, port: newPort });
            if (!create) {
                console.error('Erreur lors de la création du port');
                return { code: 500, message: 'Erreur lors de la création du port' };
            }

            allocatedPorts[currentPort] = newPort;
        }

        const influxdb = new InfluxDB({
            url: 'http://influxdb2:8086', 
            token: 'super-token-admin'
        });

        const orgsAPI = new OrgsAPI(influxdb)
        const bucketsAPI = new BucketsAPI(influxdb)

        const orgName = 'docs' // Nom de votre organisation
        const orgs = await orgsAPI.getOrgs({ org: orgName })      

        if (!orgs || !orgs.orgs || orgs.orgs.length === 0) {
            console.error(`L'organisation "${orgName}" est introuvable.`)
            return
        }
        const orgID = orgs.orgs[0].id

        const bucketName = homeid // Nom de votre bucket

        const buckets = await bucketsAPI.getBuckets({ orgID })
        const bucketExists = buckets.buckets?.some((b) => b.name === bucketName)

        if (!bucketExists) {
            await bucketsAPI.postBuckets({
                body: {
                  orgID: orgID,
                  name: bucketName
                }
            })
        }

        return { code: 200, message: { ports: allocatedPorts, bucketName: homeid } };
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la maison:', error);
        throw error;
    }
};

export const getConfig = async () => {
    let config = {
        http: {
            routers: {},
            services: {},
        },
    };

    const activePorts = await port.findAll({
        where: {
            port: {
                [Op.like]: '80%',
            },
        },
        attributes: ['homeid', 'port'],
    });

    if (!activePorts.length) {
        return null;
    }

    for (const { homeid, port } of activePorts) {
        const routerName = `${homeid}-router`;
        const serviceName = `${homeid}-service`;

        config.http.routers[routerName] = {
            entryPoints: ['web'],
            rule: `Host(\`rasp-${homeid}.g1.south-squad.io\`)`,
            service: serviceName,
        };

        config.http.services[serviceName] = {
            loadBalancer: {
                servers: [
                    {
                        url: `http://g1.south-squad.io:${port}`,
                    },
                ],
            },
        };
    }

    const yamlConfig = yaml.dump(config);

    return yamlConfig;
}