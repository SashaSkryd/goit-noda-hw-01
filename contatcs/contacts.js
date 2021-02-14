const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

ContactsSchema.plugin(mongoosePaginate)

const Сontacts = mongoose.model('Contact', ContactsSchema);

module.exports = Сontacts;