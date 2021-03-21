const router = require('express').Router()
const forms = require('../controllers/forms.controller')

router.post('/createForm', forms.createForm)
router.update('/updateForm', forms.updateForm)
router.delete('/deleteForm', forms.deleteForm)

module.exports = router
