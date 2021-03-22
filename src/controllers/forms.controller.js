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
    if (!req.body.id) {
        res.status(400).json({message: 'Bad request. You must provide a form id'})
        return
    }
    try {
        db.collection('forms').updateOne({_id: new ObjectId(req.body.id)}, {$set: {name: req.body.name, data: req.body.data}})
            .then(result => {
                if (result.modifiedCount === 1) {
                    res.status(200).json({message: 'Successfully updated the form'})
                    return
                } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                    res.status(200).json({message: 'The form is already updated'})
                    return
                } else {
                    res.status(404).json({message: 'No form using this id was found. Nothing was updated'})
                    return
                }
            })
            return
    } catch (err) {
        res.status(400).json({message: 'Bad request'})
        return
    }
}

exports.deleteForm = async (req, res) => {
    if (!req.query.id) {
        res.status(400).json({message: 'Bad request. You must provide a form id'})
        return
    }
    try {
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
        return
    } catch (err) {
        res.status(400).json({message: 'Bad request'})
        return
    }
}

exports.getForms = (_, res) => {
    db.collection('forms').find({}).toArray()
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err)
            throw err
        })
    return
}

exports.getFormData = (req, res) => {
    if (!req.query.id) {
        res.status(400).json({message: 'Bad request. You must provide a form id'})
        return
    }
    try {
        db.collection('forms').findOne({_id: new ObjectId(req.query.id)})
            .then(docs => res.status(200).json(docs))
            .catch(err => {
                console.log(err)
                throw err
            })
            return
    } catch (err) {
        res.status(400).json({message: 'Bad request'})
        return
    }
}
