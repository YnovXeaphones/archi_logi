import express from 'express';
const app = express()

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

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({success: false, error: error.message,status: error.status});
});

export default app;
