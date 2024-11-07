import express from 'express';
import mysql from 'mysql';
const app = express()

const db = mysql.createConnection({   
    host: "localhost",   
    user: "root",   
    password: "toor" 
  });

// revoie un message si le serveur est en marche, qui à fait la demande et à quelle heure et modifie la BD en conséquence.
import homeRouter from './routers/homeRouter.js';
app.use('/', homeRouter);

/*
// gerer les enregistrements. (Clé RSA)
app.use('/register', (req, res) => {
    res.send('test')
  })

// gerer l'attribution des ports.
app.use('/trafic', (req, res) => {
    res.send('')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
*/
