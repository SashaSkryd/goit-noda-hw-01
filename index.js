const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const contactsRouter = require('./contatcs/contactsRoutes');
const routerImage = require('./routerImage.js')

dotenv.config();

const PORT = process.env.port || 5500;

start();

function start() {
    const Contacts = initServer();
    connectMiddlewares(Contacts);
    declareRoutes(Contacts);
    connectToDb();
    listen(Contacts);
}

function initServer() {
  return express(); 
}

function connectMiddlewares(Contacts) {
    Contacts.use(express.json());
}

function declareRoutes(Contacts) {
    Contacts.use('/api/contacts', contactsRouter);
    Contacts.use("/images", routerImage);
}

async function connectToDb() {
    try {     
        await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
        });
        console.log("Database connection successful");
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}

function listen(Contacts) {
    Contacts.listen(PORT, () => {
        console.log('Server is listening on port', PORT);
    });
}

