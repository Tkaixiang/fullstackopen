/* "express": "^4.17.1" 
    ^ means that:
        - Major number (4) must remain the same
        - Minor number (17) >= 17
        - Patch number (1) >= 1
    "nodemon" is to allow automatic refresh during development(like in React)
    npm install --save-dev nodemon (--save-dev is to say this is a "development dependency")
*/

const { response } = require('express')
const express = require('express')
const app = express() //Create express application and store in app const
const PORT = 8000
app.listen(PORT)
console.log("Server is now running on " + PORT)


//=====MIDDLWARES=====
// Functions that handle request and response objects before/after a route is called
// Can use multiple middlewares, and they are executed in order of being called

const requestLogger = (request, response, next) => {
  console.log('Method: ' + request.method)
  console.log('Path: ' + request.path)
  console.log('Body: ' + request.body) //Called after express.json() middleware, so we have request.body
  console.log('---')
  next() //Pass execution to next middleware
}

app.use(express.json()) //Use "json-parser" middleware 
                        //Adds the "body" property to the request object (i.e request.body)
app.use(requestLogger)
//See BELOW for middleware that executes AFTER routes

let notes = [
    {
      ID: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      ID: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      ID: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]

//=====ROUTES=====
app.get('/', (request, response) => {
    //=====REQUEST & RESPONSE objects=====
    //"request" object contains information about the HTTP request (req.body etc.)
    //"response" object contains info on how to respond to it

    response.send('<h1>Waddleeeeeeeeeeeeeeeeeee</h1>') //use send() method to respond
})

app.get('/api/notes', (request, response) => {
  //=====response.json()=====
    response.json(notes) //Uses application/json Content-Type
                         //Pass in a Javascript object (which will be converted to a string)
})

//=====PARAMETERS=====
app.get('/api/notes/:id', (request, response) => {
  const ID = parseInt(request.params.id) //Parameters are stored in "params" object 
                                         //Default type is string, so need to convert to int
  const note = notes.find(note => note.ID===ID)
  if (note) response.json(note)
  else response.status(404).json({status: "error", message: "Note ID does not exist"})
  
})

app.post("/api/notes/create", (request, response) => {
  const noteContent = request.body //get JSON contents from body
  
  if ("content" in noteContent && "date" in noteContent && "important" in noteContent) {
    console.log(noteContent)
    notes.push({
      ID: notes.length + 1,
      content: noteContent.content,
      date: noteContent.date,
      important: (noteContent.important === 'true')
    })
    response.status(200).json({status: "success", message: "Note created"})
  }
  else response.status(200).json({status: "error", message: "Note is malformed"})
  
})

const unknownEndpoint = (req, res) => {
  res.status(404).send("Unknown endpoint")
}
app.use(unknownEndpoint)