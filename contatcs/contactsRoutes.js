const { Router } = require('express');
const contactController = require('./contactsControllers');
const {validToken} = require('../auth/authControllers');

const router = Router();

router.get("/sub=:sub",validToken, contactController.paginationSubscription);
router.get("/page=:page&limit=:limit",validToken, contactController.paginationPage);

router.get('/',validToken, contactController.getContacts);
router.get('/:contactId',validToken, contactController.validateId, contactController.getContact);
router.post('/',validToken, contactController.validateContacts, contactController.createContact);
router.patch('/:contactId',validToken, contactController.validateUpdateRules, contactController.validateId, contactController.updateContact);
router.delete('/:contactId',validToken, contactController.validateId, contactController.deleteContact);

module.exports = router;
