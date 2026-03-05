// /****************customers.js******************/

// 1. Chargement des modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Chargement du modèle Customer
require('./Customer');
const Customer = mongoose.model('Customer');

// 3. Connexion à MongoDB Atlas
// Remarque : Remplacez par votre propre URI si vous avez changé de base de données
const uri = 'mongodb+srv://yasmineharroudi2020_db_user:EV5ikzGjPhJp4x5B@cluster0.slqwsyq.mongodb.net/Library?retryWrites=true&w=majority';

mongoose.connect(uri)
   .then(() => console.log('Connected to MongoDB !!!'))
   .catch(err => console.error('Could not connect to MongoDB', err));

// 4. Définition des Routes

// Route 1 : Accueil
app.get('/', (req, res) => {
    res.send("Welcome to customers service !!!");
});

// Route 2 : Ajouter un nouveau client
app.post("/customer", (req, res) => {
    let newCustomer = {
        name: req.body.name,
        email: req.body.email
    };

    let customer = new Customer(newCustomer);

    customer.save().then(() => {
        console.log("New customer created!");
        res.json({ message: "a new customer added !!!" });
    }).catch((err) => {
        if(err){
            throw err;
        }
    });
});

// Route 3 : Liste des clients
app.get('/customers', (req, res) => {
    Customer.find().then((customers) => {
        console.log(customers);
        res.json({ customers: customers });
    }).catch(err => res.status(500).send(err));
});

// Route 4 : Obtenir un client par son ID
app.get('/customers/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if(customer) {
            res.json({ customer: customer });
        } else {
            res.sendStatus(404);
        }
    }).catch(err => res.status(500).send(err));
});

// Route 5 : Supprimer un client
app.delete('/customers/:id', (req, res) => { 
    // Remplacement de findOneAndRemove par findByIdAndDelete (plus standard)
    Customer.findByIdAndDelete(req.params.id).then(() => { 
        res.json({ msg: "customer deleted" }); 
    }).catch(err => res.status(500).send(err));
});

// 5. Lancement du serveur
app.listen(5555, () => console.log("Up and running! -- This is our customers service")); 
