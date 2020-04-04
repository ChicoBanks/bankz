//définition express pour gérer serveur

var express = require('express');
var request = require('request');
var port = process.env.PORT || 3000;

//définition connexion base de donnée

const mongoose = require('mongoose')
const db = mongoose.connection;

//définition movie

const Movie = require('./models/movie');

// Connection à la base de donnée

mongoose.connect('mongodb://localhost/bankz', function(err) {
    if (err)  {throw err;}
});

var bodyParser = require('body-parser');

//définition de l'objet app

var app = express();

//définition vues

app.set('view engine', 'pug');

//définition API

var router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'API'});
});

//Syteme de routage

router.route('/movies')
    .get((req, res) => {
    Movie.find({}, (err, movies) => {
        if (err) console.error(err)
        res.json(movies)
    })
})
    .post((req, res) => {
    const movie = new Movie(req.body)
    movie.save((err, movie) =>{
        if (err) console.error(err)
        res.json({message: 'Movie added !'});
    })
})

router.route('/movie/:id')
    .get((req, res) => {
    const id = req.params.id;
    Movie.findById(id, (err, movie) => {
        if (err) console.error(err)
        res.json(movie)
        })
    })
    .put((req, res) => {
    const id = req.params.id;
    Movie.findById(id, (err, movie) => {
        if (err) console.error(err)
        Object.assign(movie, req.body).save((err, movie) => {
            if (err) console.error(err)
            res.json({message: ''})
            })
        })
    })
    .delete((req, res) => {
    Movie.findByIdAndDelete(req.params.id, (err, movie) => {
        if (err) return console.error(err)
        res.json({message: "Movie sucessfully deleted"})
    })
    Movie.findById(id, (err, movie) => {
        if (err) console.error(err)
        res.json(movie)
    })
})


app.use(bodyParser.urlencoded({ extended: false }));

// Getion erreur en cas d'url non valide

router.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404)
});


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/results', (req, res) => {
    res.render('results');
});

router.use((req, res) => {
});

app.get('/', (req, res) => {
     Movie.find({}, (err, movies) => {
        if (err) console.error(err)
            res.render('home', {title: 'movie list', movies: movies})
        })
})

app.get('/:id', (req, res) => {
    Movie.findById(req.params.id).then(movie => {
        res.render('display', {movie: movie});
        }, err => res.status(500).send(err));
});

app.get('/login', (req, res) => {
    res.render('login')
  })

app.get('/register', (req, res) => {
    res.render('register')
})

app.use('/api', router);


// ECOUTE SERVEUR

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})