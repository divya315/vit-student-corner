const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const MongoClient = require('mongodb').MongoClient
const morgan = require('morgan');
const mongoose = require('mongoose');

const logPartRoutes = require(path.join(__dirname,'/api/routes/loginpart'));

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost/loginDetails', {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = app;

var db
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) return console.log(err)
  db = client.db('web-assignment')
})

app.post("/addproject", (req, res) => {
  var item = {
    "chapname": req.body.chapname,
    "projAbout": req.body.projAbout
  }
  db.collection('projects').save(item, (err, result) => {
    if (err) return console.log(err)
    console.log('Item inserted')
    res.redirect('/Projects')
  })
});

app.post("/addevent", (req, res) => {
  var item = {
    "chapname": req.body.chapname,
    "eveAbout": req.body.eveAbout
  }
  db.collection('eves').save(item, (err, result) => {
    if (err) return console.log(err)
    console.log('Item inserted')
    res.redirect('/Events')
  })
});

app.post("/stud-recruit", (req, res) => {
  var item = {
    "studReg": req.body.studReg,
    "studAbout": req.body.studAbout
  }
  db.collection('students').save(item, (err, result) => {
    if (err) return console.log(err)
    console.log('Item inserted')
    res.redirect('/Recruitments')
  })
});

app.post("/chap-recruit", (req, res) => {
  var item = {
    "chapName": req.body.chapName,
    "chapAbout": req.body.chapAbout
  }
  db.collection('chapters').save(item, (err, result) => {
    if (err) return console.log(err)
    console.log('Item inserted')
    res.redirect('/Recruitments')
  })
});

app.get("/Projects", function(req, res){
  db.collection('projects').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('Projects.ejs', {projects: result})
  })
})

app.get("/Events", function(req, res){
  db.collection('eves').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('Events.ejs', {eves: result})
  })
});

app.get("/Recruitments", function(req, res){
  db.collection('students').find().toArray((err1, result1) => {
    if (err1) return console.log(err)
    db.collection('chapters').find().toArray((err2, result2) => {
      if (err2) return console.log(err)
      res.render('Recruitments.ejs', {
        students: result1,
        chapters: result2
      })
    })
  })
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
})

app.use('/log', logPartRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(PORT, () =>
  console.log(`Node server running on port ${PORT}`)
);
