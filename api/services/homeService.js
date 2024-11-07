import { home } from '../models/indexModel.js';

const addPing = (mac) => {
    return home.addPing(mac);
};

export default {
    addPing: addPing
}