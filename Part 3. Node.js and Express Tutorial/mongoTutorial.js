const mongoDB = require('mongodb')
const url = "mongodb://localhost:27017"

const MongoClient = mongoDB.MongoClient
MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async (client) => {
    let db = client.db("nodeMongoDBTest") //get the database
    const customersCollection = db.collection("customers")

    //Clear collection first
    await customersCollection.deleteMany({})

    const testObject = { name: "Company Inc", address: "Highway 37" }
    await customersCollection.insertOne(testObject) //Have to add "await" as nodeJS is async, and it will jump to client.close() before this insert is completed

    const testList = [
        { name: 'John', address: 'Highway 71'},
        { name: 'Peter', address: 'Lowstreet 4'},
        { name: 'Amy', address: 'Apple st 652'},
        { name: 'Hannah', address: 'Mountain 21'},
        { name: 'Michael', address: 'Valley 345'},
        { name: 'Sandy', address: 'Ocean blvd 2'},
        { name: 'Betty', address: 'Green Grass 1'},
        { name: 'Richard', address: 'Sky st 331'},
        { name: 'Susan', address: 'One way 98'},
        { name: 'Vicky', address: 'Yellow Garden 2'},
        { name: 'Ben', address: 'Park Lane 38'},
        { name: 'William', address: 'Central st 954'},
        { name: 'Chuck', address: 'Main Road 989'},
        { name: 'Viola', address: 'Sideway 1633'}
    ]
    await customersCollection.insertMany(testList)

    await customersCollection.updateOne({name: "Sandy"}, {$set: {name: "Sandy Bash"}})
    await customersCollection.updateMany({name: {$exists: 1}}, {$set: {checked: true }})

    const stuff = await customersCollection.find({}, {sort: {name: -1}, projection: {_id: 0}}).toArray() //Have to format it like this to use projections and sorting
    console.log(stuff)

    client.close() 
}).catch(err => {
    console.log("Error occured in MongoDB")
    console.log(err)
})