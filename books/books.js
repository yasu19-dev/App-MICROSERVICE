// 1. Chargement des modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const app = express();

// Configuration de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Chargement du modèle Book
require('./Book');
const Book = mongoose.model('Book');

// 3. Connexion à MongoDB Atlas
const uri = 'mongodb+srv://yasmineharroudi2020_db_user:EV5ikzGjPhJp4x5B@cluster0.slqwsyq.mongodb.net/Library?retryWrites=true&w=majority';

mongoose.connect(uri)
   .then(() => console.log('Connected to MongoDB !!!'))
   .catch(err => console.error('Could not connect to MongoDB', err));

// 4. Définition des Routes

// Route d'accueil
app.get('/', (req, res) => {
    res.send("Welcome to books service !!!");
});

// Route POST : Créer un livre
app.post("/book", (req, res) => {
    let newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher
    };

    let book = new Book(newBook);

    book.save().then(() => {
        console.log("New book created!");
        res.status(201).json({ message: "A new book added !!!" });
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Erreur lors de la création du livre");
    });
});

// Route GET : Afficher tous les livres
app.get('/books', (req, res) => {  
    Book.find().then((books) => {
        res.json({ books: books });
    }).catch(err => res.status(500).send(err));
});

// Route GET : Chercher un livre par son ID
app.get('/books/:id', (req, res) => {  
    Book.findById(req.params.id).then((book) => {
        if(book) {
            res.json({ book: book });
        } else {
            res.sendStatus(404);
        } 
    }).catch(err => res.status(500).send(err));  
});

// Route DELETE : Supprimer un livre
app.delete('/books/:id', (req, res) => {
    // Utilisation de findByIdAndDelete (plus récent que findByIdAndRemove)
    Book.findByIdAndDelete(req.params.id).then(() => {        
        res.json({ msg: "Book deleted" });            
    }).catch(err => res.status(500).send(err));
});

// 5. Lancement du serveur
app.listen(4545, () => {
    console.log("Up and running! -- This is our Books service on port 4545");
})