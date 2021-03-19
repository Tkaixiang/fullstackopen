const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())
app.listen(PORT)
console.log("Server is now running on port " + PORT)

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

app.get('/api/persons', (request, response) => {
    return response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id)
    const record = phonebook.find(record => record.id === id)

    if (record) response.json(record)
    else response.status(404).json({status: "error", message: "phonebook with record " + id + " not found."})
})

app.post('/api/persons/delete', (req, res) => {
    const contents = req.body
    if ("id" in contents) {
        for (let i = 0; i < phonebook.length; i++) {
            if (phonebook[i].id === parseInt(contents.id)) {
                phonebook.splice(i, 1) //remove array element at i
                return res.json({status: "success", message: "deleted phonebook with id " + contents.id})
            }
        }
        res.json({status: "error", message: "phonebook with record " + contents.id + " not found."})
    }
    else {
        res.json({status: "error", message: "phonebook with record " + contents.id + " not found."})
    }
})

app.post('/api/persons/create', (req, res) => {
    const contents = req.body
    if ("name" in contents && "number" in contents) {
        for (let i = 0; i < phonebook.length; i++) {
            if (phonebook[i].name === contents.name) return res.json({status: "error", message: "name must be unique"})
        }
        const id = Math.floor(Math.random() * 99999999) //might have collisions, but owell
        phonebook.push({
            id: id,
            name: contents.name,
            number: contents.number
        })
        res.json({status: "success", message: "successfully created phonebook with id " + id})
    }
    else {
        res.json({status: "error", message: "Body malformed. Missing name or number field"})
    }
})

app.get('/info', (request, response) => {
    response.setHeader("Content-Type", "text/html") //technically not required as res.send() automatically sets this when you send a string
                                                    //also automatically sets to JSON when you send an object in
    response.send("Phonebook has info for " + phonebook.length + " people. <br><br>Request received on: " + new Date())
})



