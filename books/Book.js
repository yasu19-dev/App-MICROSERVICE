const mongoose = require("mongoose");

// Définition du modèle Book
mongoose.model("Book", {
    title: {
        type: String,
        required: true // Correction : 'required' avec un 'd'
    },
    author: {
        type: String,
        required: true
    },
    numberPages: {
        type: Number,
        required: false
    },
    publisher: {
        type: String,
        required: false
    }
});