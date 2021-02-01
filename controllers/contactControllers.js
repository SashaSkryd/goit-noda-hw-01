const fs = require("fs").promises
const path = require("path")
const contactsPath = path.join("db/contacts.json")
const contacts = require("../db/contacts.json")
const Joi = require("joi")
const ids = require("short-id")

function listContacts(req, res) {
  res.json(contacts)
}

function getById(req, res) {
  const {
    params: { contactId },
  } = req
  notFound(res, contactId)
  const contactIndex = contacts.findIndex((contact) => contact.id === contactId)
  res.json(contacts[contactIndex])
}

function validateContacts(req, res, next) {
  const validateRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  })
  const validateResult = validateRules.validate(req.body)
  if (validateResult.error) {
    return res.status(400).send({ message: "missing required name field" })
  }
  next()
}

function addContact(req, res) {
  const addContact = {
    id: ids.generate(),
    ...req.body,
  }
  contacts.push(addContact)
  res.status(201).send(addContact)
  fs.writeFile(contactsPath, JSON.stringify(contacts))
}

function removeContact(req, res) {
  const {
    params: { contactId },
  } = req
  notFound(res, contactId)
  const index = contacts.findIndex((contact) => contact.id === contactId)
  contacts.splice(index, 1)
  res.status(200).send({ message: "contact deleted" })
  fs.writeFile(contactsPath, JSON.stringify(contacts))
}

function validateUpdateRules(req, res, next) {
  const validateRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).min(1);
  const validateResult = validateRules.validate(req.body)
  if (validateResult.error) {
    return res.status(400).send({ message: "missing required name field" })
  }
  next()
}

function updateContact(req, res) {
  const {
    params: { contactId },
  } = req
  notFound(res, contactId)
  const contactIndex = contacts.findIndex((contact) => contact.id === contactId)
  const updatedUser = {
    ...contacts[contactIndex],
    ...req.body,
  }
  contacts[contactIndex] = updatedUser
  fs.writeFile(contactsPath, JSON.stringify(contacts))
  res.json(updatedUser)
}

function notFound(res, contactId) {
  const contact = contacts.find((contact) => contact.id === contactId)
  if (!contact) {
    return res.status(404).send({ message: "Not found" })
  }
}

module.exports = {
  listContacts,
  getById,
  addContact,
  validateContacts,
  removeContact,
  updateContact,
  validateUpdateRules,
}
