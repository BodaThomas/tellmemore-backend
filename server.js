const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.set('PORT', process.env.PORT || port)
app.use(cors())
app.use(express.json())
app.get('/', (_, res) => {
    res.send('Hello World!')
})

app.use('/', require('./src/routes/forms.route'))

app.listen(app.get('PORT'), () => {
    console.log(`Server running on port ${app.get('PORT')}`)
})

module.exports = app
