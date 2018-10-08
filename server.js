console.log('May Node be with you')

const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.sendFile('D:/KuAmirul/Documents/GitHub/crud-app' + '/index.html')
  // Note: __dirname is directory that contains the JavaScript source code. 
})


MongoClient.connect('mongodb://admin:localhost1@ds125423.mlab.com:25423/testdata', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)
  db = client.db('testdata') // whatever your database name is
  app.listen(3000, () => {
    console.log('listening on 3000 from Mongo')
  })
})

app.post('/values', (req, res) => {
  db.collection('values').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})