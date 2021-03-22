const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const dbName = 'tellMeMore'
const url = 'mongodb://localhost:27017' + dbName
let db

MongoClient.connect(url, (err, client) => {
   console.log("Successfully connected to the server")
   db = client.db(dbName)
   if(err) throw err
   db.createCollection('forms', {}, (err, _) => {
        if (err) {}
    })
   db.createCollection('results', {}, (err, _) => {
        if (err) {}
    })
})

exports.createForm = (req, res) => {
    if (!req.body.name || !req.body.data) {
        res.status(400).json({message: 'Bad request'})
        return
    }
    db.collection('forms').insertOne({
        name: req.body.name,
        createdAt: new Date(),
        data: req.body.data
    })
        .then(doc => res.status(200).json({...doc.ops[0], message: 'Successfully created the form'}))
    return
}

exports.updateForm = (req, res) => {

}

exports.deleteForm = async (req, res) => {
    if (!req.query.id) {
        res.status(400).json({message: 'Bad request'})
        return
    }
    db.collection('forms').deleteOne({_id: new ObjectId(req.query.id)})
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(200).json({message: 'Successfully deleted the form'})
                return
            } else {
                res.status(404).json({message: 'No form using this id was found. Nothing was deleted'})
                return
            } 
        })
}

exports.getForms = (req, res) => {
    db.collection('forms').find({}).toArray()
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err)
            throw err
        })
}

exports.getFormData = (req, res) => {
    if (!req.query.id) {
        res.status(400).json({message: 'Bad request'})
        return
    }
    console.log(req.query.id)
    db.collection('forms').findOne({_id: new ObjectId(req.query.id)})
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err)
            throw err
        })
    return
}
