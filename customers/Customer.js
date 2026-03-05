// /***************Customer.js************/
const mongoose = require("mongoose"); 

mongoose.model("Customer", { 
    name: { 
        type: String, 
        required: true // Correction : 'required'
    },
    email: { 
        type: String, 
        required: true // Correction : 'required'
    }
}); 