const router = require('express').Router()
const results = require('../controllers/results.controller')

router.post('/addResult', results.addResult)
router.get('/getResults', results.getResults)

module.exports = router