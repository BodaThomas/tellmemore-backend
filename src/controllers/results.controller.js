const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const dbName = 'tellMeMore'
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017' + dbName
let db

MongoClient.connect(url, (err, client) => {
   if(err) throw err
   console.log("Successfully connected to the server")
   db = client.db(dbName)
   db.createCollection('forms', {}, (err, _) => {
        if (err) {}
    })
   db.createCollection('results', {}, (err, _) => {
        if (err) {}
    })
})

exports.addResult = (req, res) => {
    if (!req.body.formId || !req.body.data) {
        res.status(400).json({message: 'Bad request'})
        return
    }
    db.collection('results').insertOne({
        formId: req.body.formId,
        data: req.body.data
    })
        .then(doc => res.status(200).json({...doc.ops[0], message: 'Successfully added the response'}))
    return
}

exports.getResults = (req, res) => {
    if (!req.query.formId) {
        res.status(400).json({message: 'Bad request. You must provide a formId'})
        return
    }
    db.collection('results').find({formId: req.query.formId}).toArray()
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err)
            throw err
        })
    return
}
