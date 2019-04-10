console.log('May Node be with you')

const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json())

app.get('/', (req, res) => {
  // res.sendFile('D:/KuAmirul/Documents/GitHub/crud-app' + '/index.html')
  // var cursor = db.collection('values').find()
  // Note: __dirname is directory that contains the JavaScript source code. 

    // db.collection('values').find().toArray(function(err, results) {
  // console.log(results)
  // send HTML file populated with quotes here
  // })
  
  db.collection('values').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {values: result})
  })  
  
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

// res.render(view, locals)


app.put('/values', (req, res) => {
  db.collection('values')
  .findOneAndUpdate({name: 'Lorem'}, {
    $set: {
      name: req.body.name,
      values: req.body.values
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


