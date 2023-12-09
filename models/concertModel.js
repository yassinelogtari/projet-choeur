const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    lieu: {
        type: String,
        required: true,
    },
    affiche: {
        type: String, 
        default: null,
    },
    themeprogramme :{ type:String, required :true},
    programme: [
        {
            oeuvre: {
                type: mongoose.Schema.ObjectId,
                ref: 'Oeuvre', 
                required: true,
            }
        }
    ],
}, { timestamps: true });

const Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;
