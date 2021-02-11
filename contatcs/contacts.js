const mongoose = require('mongoose');

const { Schema } = mongoose;

const ContactsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => value.includes('@'),
    },
    phone: {
        type: String,
        required: true,
    },
},
{
 timestamps: true
},
);

const Сontacts = mongoose.model('Contact', ContactsSchema);

module.exports = Сontacts;