const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios"); // Importation d'Axios

const app = express();
app.use(bodyParser.json());

// 1. Chargement du modèle
require("./Order");
const Order = mongoose.model("Order");

// 2. Connexion à MongoDB Atlas (Mettez votre propre lien avec /Library)
const uri = 'mongodb+srv://yasmineharroudi2020_db_user:EV5ikzGjPhJp4x5B@cluster0.slqwsyq.mongodb.net/Library?retryWrites=true&w=majority';

mongoose.connect(uri)
   .then(() => console.log('Connected to MongoDB - Orders Service !!!'))
   .catch(err => console.error('Could not connect to MongoDB', err));

// 3. Route POST pour créer une commande
app.post("/order", (req, res) => {
    let newOrder = {
        CustomerID: req.body.CustomerID,
        BookID: req.body.BookID
    };
    let order = new Order(newOrder);
    order.save().then(() => {
        res.status(201).json({ message: "Order created successfully!" });
    }).catch(err => res.status(500).send(err));
});

// 4. Route GET pour afficher les détails de la commande avec Axios
// C'est ici que la communication entre les microservices se fait
app.get("/order/:id", (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if (!order) {
            return res.status(404).send("Order not found");
        }

        // Appel au microservice Customers (Port 5555)
        axios.get("http://localhost:5555/customers/" + order.CustomerID).then((responseCustomer) => {
            
            let orderObject = { 
                customerName: responseCustomer.data.customer.name, 
                bookTitle: '' 
            }; 

            // Appel au microservice Books (Port 4545)
            axios.get("http://localhost:4545/books/" + order.BookID).then((responseBook) => {
                
                orderObject.bookTitle = responseBook.data.book.title; 
                
                // Envoi de la réponse finale combinée
                res.json({ "order": orderObject }); 
                
            }).catch(err => res.status(500).send("Erreur lors de la récupération du livre"));
            
        }).catch(err => res.status(500).send("Erreur lors de la récupération du client"));
    }).catch(err => res.status(500).send("Erreur serveur"));
});

// 5. Lancement du serveur sur un 3ème port (ex: 7777)
app.listen(7777, () => console.log("Up and running! -- This is our Orders service on port 7777"));