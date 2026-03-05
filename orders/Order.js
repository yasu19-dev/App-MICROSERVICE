const mongoose = require("mongoose");

mongoose.model("Order", {
    CustomerID: {
        type: String, // On stocke l'ID du client sous forme de texte
        required: true
    },
    BookID: {
        type: String, // On stocke l'ID du livre
        required: true
    },
    initialDate: {
        type: Date,
        default: Date.now
    }
});