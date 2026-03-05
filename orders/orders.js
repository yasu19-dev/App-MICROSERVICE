const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Chargement du modèle Order 
require('./Order');
const Order = mongoose.model('Order');

// Connexion à VOTRE base de données MongoDB Atlas
const uri = 'mongodb+srv://yasmineharroudi2020_db_user:EV5ikzGjPhJp4x5B@cluster0.slqwsyq.mongodb.net/Library?retryWrites=true&w=majority';

mongoose.connect(uri)
   .then(() => console.log('Connected to MongoDB !!!'))
   .catch(err => console.error('Could not connect to MongoDB', err));


// --- DÉFINITION DES ROUTES ---

// Route 1 : Accueil (GET)
app.get('/', (req, res) => {
    res.send("Welcome to orders service !!!");
});

// Route 2 : Ajouter une nouvelle commande (POST)
app.post("/order", (req, res) => {
    let newOrder = {
        CustomerID: new ObjectId(req.body.CustomerID), // Convertit la chaîne en ObjectId
        BookID: new ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    };

    let order = new Order(newOrder);

    order.save().then(() => {
        console.log("New order created!");
        res.status(201).json({ message: "A new order added !!!" });
    }).catch((err) => {
        console.error("Erreur de création :", err);
        res.status(500).send("Erreur lors de la création de la commande");
    });
});

// Route 3 : Liste des commandes (GET)
app.get('/orders', (req, res) => {
    Order.find().then((orders) => {
        res.json({ orders: orders });
    }).catch(err => res.status(500).send(err));
});

// Route 4 : Obtenir une commande par son ID (GET)
app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order) {
            res.json({ order: order });
        } else {
            res.status(404).send("Commande introuvable");
        }
    }).catch(err => res.status(500).send(err));
});

// Route 5 : Mettre à jour une commande (PUT)
app.put('/order/:id', (req, res) => {
    let updateData = {
        CustomerID: new ObjectId(req.body.CustomerID),
        BookID: new ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    };

    Order.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .then((updatedOrder) => {
            if (updatedOrder) {
                res.json({ message: "Order updated successfully!", order: updatedOrder });
            } else {
                res.status(404).send("Commande non trouvée");
            }
        })
        .catch(err => res.status(500).send("Erreur lors de la mise à jour : " + err));
});

// Route 6 : Supprimer une commande (DELETE)
app.delete('/order/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(() => {
        res.json({ msg: "Order deleted" });
    }).catch(err => res.status(500).send(err));
});

// Lancement du serveur sur le port 6666
app.listen(6666, () => console.log("Up and running! -- This is our orders service on port 6666"));