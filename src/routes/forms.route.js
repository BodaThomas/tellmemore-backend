const router = require('express').Router()
const forms = require('../controllers/forms.controller')

router.post('/createForm', forms.createForm)
router.post('/updateForm', forms.updateForm)
router.delete('/deleteForm', forms.deleteForm)
router.get('/getForms', forms.getForms)
router.get('/getFormData', forms.getFormData)

module.exports = router
