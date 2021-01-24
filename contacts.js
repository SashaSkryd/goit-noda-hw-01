const fs = require('fs').promises
const path = require('path')
const ids = require('short-id');


const contactsPath = path.join('./db/contacts.json')

async function listContacts() {
    try {
        const list = await fs.readFile(contactsPath, "utf-8");
        return JSON.parse(list);
    }
    catch (error) {
        return error;
    }
}

async function getContactById(contactId) {
    const get = await listContacts();
    const contact = get.find((el) => el.id === contactId);
    return contact;
}

async function removeContact(contactId) {
    const remove = await getContactById(contactId)
    if (remove) {
        const get = await listContacts();
        const filter = get.filter((el) => el.id !== contactId);
        fs.writeFile(contactsPath, JSON.stringify(filter), 'utf-8');
        return filter;
    }
    else {
        return "Error, you not can delete this contact"
    }
}

async function addContact(name, email, phone) {
    const get = await listContacts();
    const addContact = {
        id: ids.generate(),
        name: name,
        email: email,
        phone: phone
    };
    const remove = await getContactById(addContact.id);
    if (!remove) {
        get.push(addContact);
        fs.writeFile(contactsPath, JSON.stringify(get), "utf-8");
        return get;
    }
    else {
        return "Error, this contact is already in your contacts";
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}