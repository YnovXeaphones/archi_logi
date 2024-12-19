import { addPing, addHome , getActiveDevices} from '../services/homeService.js';
import fs from 'fs';
import path from 'path';


export const ping = async (req, res) => {
    try {
        const { mac } = req.body;

        if (!mac) {
            return res.status(400).json({ message: 'Erreur : "mac" est requis dans le corps de la requête.' });
        }

        const ping = await addPing(mac);
        if (ping.code === 200) {
            res.status(200).json({ message: "Ping reçu et last_ping mis à jour", updated_at: ping.message });
        } else {
            res.status(ping.code).json({ message: 'Erreur serveur lors de la mise à jour du last_ping', error: ping.message });
        }
    } catch (error) {
        console.error('Erreur de mise à jour du last_ping:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export const register = async (req, res) => {
    try {
        const { mac, sshkey } = req.body;

        if (!mac || !sshkey) {
            return res.status(400).json({ message: 'Erreur : "mac" et "sshkey" sont requis dans le corps de la requête.' });
        }

        const register = await addHome(mac, sshkey);
        if (register.code === 200) {
            res.status(200).json({ message: "Enregistrement réussi", created_at: register.message });
        } else {
            res.status(register.code).json({ message: 'Erreur serveur lors de l\'enregistrement', error: register.message });
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export const traefikconfig = async (req, res) => {
    try {
        // Récupérer les appareils actifs
        const activeDevices = await getActiveDevices();

        if (!activeDevices || activeDevices.length === 0) {
            return res.status(200).json({ http: { routers: {}, services: {} } });
        }

        // Construire la configuration dynamique
        const config = {
            http: {
                routers: {},
                services: {},
            },
        };

        activeDevices.forEach((device) => {
            const mac = device.mac.replace(/:/g, '-'); // Remplacer ":" par "-" pour un format valide
            const host = `rasp-${mac}.g1.south-squad.io`; // Construire le domaine basé sur le MAC

            // Ajouter un routeur
            config.http.routers[`${mac}-router`] = {
                entryPoints: ['web'],
                rule: `Host(\`${host}\`)`,
                service: `${mac}-service`,
            };

            // Ajouter un service
            config.http.services[`${mac}-service`] = {
                loadBalancer: {
                    servers: [
                        {
                            url: `http://${host}`, // Utilisation du domaine basé sur le MAC
                        },
                    ],
                },
            };
        });



        // Chemin vers le fichier dynamic-config.yml
        const configDir = path.resolve('/app/config/traefik');
        const configPath = path.join(configDir, 'dynamic-config.yml');

        // Vérifier si le répertoire existe, sinon le créer
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        // Écrire la configuration dans le fichier
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));



        // Retourner la configuration
        res.status(200).json(config);
    } catch (error) {
        console.error('Erreur lors de la génération de la configuration Traefik:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export default { ping, register, traefikconfig };