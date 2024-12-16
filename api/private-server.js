import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 7880;

// Middleware pour parser les requêtes JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.post('/', (req, res) => {
    let sshkey = req.body.sshkey;

    if (!sshkey) {
        return res.status(400).json({success: false, error: 'No sshkey provided'});
    }

    fs.appendFile('/root/.ssh/authorized_keys', sshkey + '\n', (err) => {
        if (err) {
            return res.status(500).json({success: false, error: err.message});
        }
        res.status(201).json({success: true, message: 'SSH key added to authorized_keys'});
    });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({success: false, error: error.message,status: error.status});
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
