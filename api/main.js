const express = require('express')
const app = express()
const port = 3000

// revoie un message si le serveur est en marche, qui à fait la demande et à quelle heure et modifie la BD en conséquence.
app.get('/ping', (req, res) => {
  res.send('Server is running')
})

// gerer les enregistrements. (Clé RSA)
app.get('/register', (req, res) => {
    res.send('')
  })

// gerer l'attribution des ports.
app.get('/trafic', (req, res) => {
    res.send('')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
