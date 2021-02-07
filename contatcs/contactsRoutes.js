const { Router } = require('express');
const contactController = require('./contactsControllers');

const router = Router();

router.get('/', contactController.getContacts);
router.get('/:contactId', contactController.validateId, contactController.getContact);
router.post('/',contactController.validateContacts, contactController.createContact);
router.patch('/:contactId',contactController.validateUpdateRules, contactController.validateId, contactController.updateContact);
router.delete('/:contactId', contactController.validateId, contactController.deleteContact);

module.exports = router;
