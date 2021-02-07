
const {
    Types: { ObjectId },
} = require('mongoose');
const contacts = require('./contacts.js');

async function getContacts(req, res) {
    const contact = await contacts.find();
    res.json(contact);
}

async function createContact(req, res) {
    try {
        const { body } = req;
        const contact = await contacts.create(body);
        res.json(contact);
    } catch (error) {
        res.status(400).send(error);
    }
}

async function updateContact(req, res) {
    const {
        params: { contactId },
    } = req;

    const updatedContact = await contacts.findByIdAndUpdate(contactId, req.body, {
        new: true,
    });

    if (!updatedContact) {
        return res.status(400).send("contact isn't found");
    }

    res.json(updatedContact);
}

async function deleteContact(req, res) {
    const {
        params: { contactId },
    } = req;

    const deletedContact = await contacts.findByIdAndDelete(contactId)

    if (!deletedContact) {
        return res.status(400).send("contact isn't found");
    }

    res.json(deletedContact);
}

function validateId(req, res, next) {
    const {
        params: { contactId },
    } = req;

    if (!ObjectId.isValid(contactId)) {
        return res.status(400).send('Your id is not valid');
    }

    next();
}

async function getContact(req, res) {
    const {
        params: { contactId },
    } = req;

    const contact = await contacts.findById(contactId);

    if (!contact) {
        return res.status(400).send("contact isn't found");
    }

    res.json(contact);
}

function validateContacts(req, res, next) {
  const validateContactsRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  })
  const validateContactsResult = validateContactsRules.validate(req.body)
  if (validateContactsResult.error) {
    return res.status(400).send({ message: "missing required name field" })
  }
  next()
}

function validateUpdateRules(req, res, next) {
  const validateUpdateRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).min(1);
  const validateUpdateResult = validateUpdateRules.validate(req.body)
  if (validateUpdateResult.error) {
    return res.status(400).send({ message: "missing required name field" })
  }
  next()
}

module.exports = {
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    validateId,
    getContact,
    validateUpdateRules,
    validateContacts
};

