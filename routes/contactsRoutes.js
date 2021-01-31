const Router = require("express")
const morgan = require("morgan")

const {
  listContacts,
  getById,
  addContact,
  validateContacts,
  removeContact,
  updateContact,
  validateUpdateRules,
} = require("../controllers/contactControllers.js")

const router = Router()

router.use(morgan("dev"))
router.get("/", listContacts)
router.get("/:contactId", getById)
router.post("/", validateContacts, addContact)
router.patch("/:contactId", validateUpdateRules, updateContact)
router.delete("/:contactId", removeContact)

module.exports = router
