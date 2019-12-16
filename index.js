const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
//const morgan = require('morgan')

app.use(bodyParser.json())

//morgan.token('content', function (req, res) { return JSON.stringify(req.body)})

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
      {
        name: "Tom Joad",
        number: "666n",
        id: 5
      },
      {
        name: "jjjjjj",
        number: "lllllllll",
        id: 8
      },
      {
        name: "gggggggggggggg",
        number: "yyyyyyyyyyyy",
        id: 9
      },
    ]

const generateId = () => Math.floor(Math.random()*10000)

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<div><p>Phonebook currently has info on ${persons.length} people.</p><p>${new Date()}</p></div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
    res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const name = req.body.name
    const number = req.body.number
    const matchFound = persons.some(person => person.name === name)

    if (!name || !number || matchFound ) {
        return res.status(400).json({error: 'content missing'})
    }

    const person = {
        name: name,
        number: number,
        id: generateId(),
    }

    persons = persons.concat(person)
    res.json(person)

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})