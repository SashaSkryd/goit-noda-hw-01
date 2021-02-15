
const {
    Types: { ObjectId },
} = require('mongoose');
const Сontacts = require('./contacts.js');

async function getContacts(req, res) {
    const contact = await Сontacts.find();
    res.json(contact);
}

async function createContact(req, res) {
    try {
        const { body } = req;
        const contact = await Сontacts.create(body);
        res.json(contact);
    } catch (error) {
        res.status(400).send(error);
    }
}

async function updateContact(req, res) {
    const {
        params: { contactId },
    } = req;

    const updatedContact = await Сontacts.findByIdAndUpdate(contactId, req.body, {
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

    const deletedContact = await Сontacts.findByIdAndDelete(contactId)

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

    const contact = await Сontacts.findById(contactId);

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

async function paginationPage(req, res) {
  const {
    params: { page, limit },
  } = req;

const contact = await Сontacts.paginate({}, { limit: limit, page: page });
   res.json(contact.docs);
}
async function paginationSubscription(req, res) {
  const {
    params: { sub },
  } = req;

  const contact = await Сontacts.paginate({ subscription: sub },{ limit: 20, page: 1})
  res.json(contact.docs);
}

module.exports = {
    paginationSubscription,
    paginationPage,
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    validateId,
    getContact,
    validateUpdateRules,
    validateContacts
};

