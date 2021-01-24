const { listContacts, getContactById, removeContact, addContact } = require("./contacts.js");
const argv = require('yargs').argv;

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
          console.table(await listContacts());
      break;

    case 'get':
          console.table(await getContactById(id));
      break;

    case 'add':
          console.table(await addContact(name, email, phone));
      break;

    case 'remove':
      console.table(await removeContact(id))
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);