const express = require('express')
const mongoDB = require('mongodb')
//const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = 8000

let phonebook = [
    {
        id: 1,
        name: "waddle1",
        number: "237493832"
    },
    {
        id: 2,
        name: "waddle2",
        number: "432564563"
    },
    {
        id: 3,
        name: "waddle3",
        number: "394843322"
    },
    {
        id: 4,
        name: "waddle4",
        number: "934845920"
    }
]

app.use(express.json())
//Just prints data from requests
/*app.use(morgan((tokens, req, res) => {
    console.log(req.body)
    return [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens.res(req, res, 'content-length')].join(' ')
}))*/
app.use(cors()) //Add CORS
app.listen(PORT)
console.log("Server is now running on port " + PORT)


mongoDB.MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async (client) => {
    const db = client.db("nodeMongoDBTest")
    const collection = db.collection("phonebook")
    
    await collection.deleteMany({}) // returns { n: 4, ok: 1 }
    await collection.insertMany(phonebook)

    app.get('/api/persons', async (request, response) => {
        const records = await collection.find({}, {"projection": {"_id": 0}}).toArray()
        return response.json(records)
    })

    app.get('/api/persons/:id', async (request, response) => {
        const id = parseInt(request.params.id)
        const record = await collection.findOne({"id": id}, {projection: {"_id": 0}})

        if (record) response.json(record)
        else response.status(404).json({ status: "error", message: "phonebook with record " + id + " not found." })
    })

    app.post('/api/persons/delete', async (req, res) => {
        const contents = req.body
        if ("id" in contents) {
            const deleteInfo = await collection.deleteOne({id: parseInt(contents.id)})
            if (deleteInfo.result.n === 1) return res.json({ status: "success", message: "deleted phonebook with id " + contents.id })
            else res.json({ status: "error", message: "phonebook with record " + contents.id + " not found." })
        }
        else {
            res.json({ status: "error", message: "phonebook with record " + contents.id + " not found." })
        }
    })

    app.post('/api/persons/create', async (req, res) => {
        const contents = req.body
        if ("name" in contents && "number" in contents) {
            const checkIfExist = await collection.find({"name": contents.name}, {"_id": 0}).count()   
            if (checkIfExist === 1) return res.json({ status: "error", message: "name must be unique" })


            const id = Math.floor(Math.random() * 99999999) //might have collisions, but owell

            await collection.insertOne({
                id: id,
                name: contents.name,
                number: contents.number
            })
            res.json({ status: "success", message: "successfully created phonebook with id " + id })
        }
        else {
            res.json({ status: "error", message: "Body malformed. Missing name or number field" })
        }
    })

    app.get('/info', async (request, response) => {
        response.setHeader("Content-Type", "text/html") //technically not required as res.send() automatically sets this when you send a string
        //also automatically sets to JSON when you send an object in
        const amount = await collection.find({}).count()
        response.send("Phonebook has info for " + amount + " people. <br><br>Request received on: " + new Date())
    })

    //Middleware that executes afterwards
    const unknownEndpoint = (req, res) => {
        res.status(404).send("Unknown webpage")
    }
    app.use(unknownEndpoint)


}).catch((err) => {
    console.log("Connection to database failed")
    console.log(err)
})











