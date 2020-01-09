require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Contact = require('./models/contact')
 
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))



const generateId = () => Math.floor(Math.random()*10000)

app.get('/api/persons', (req, res, next) => {
    Contact.find({}).then(contacts => {
        res.json(contacts.map(c => c.toJSON()))
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Contact.find({})
      .then(contacts => 
      res.send(`<div><p>Phonebook currently has info on ${contacts.length} people.</p><p>${new Date()}</p></div>`)
    )
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
        res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const name = req.body.name
    const number = req.body.number
    const person = new Contact({
        name: name,
        number: number,
        id: generateId(),
    })

    person
      .save()
      .then(savedPerson => res.json(savedPerson.toJSON()))
      .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const contact = {
      name: body.name,
      number: body.number,
    }
    Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
      .then(updatedContact => {
        res.json(updatedContact.toJSON())
      })
      .catch(error => next(error))
  })

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})



const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
    console.error(`error begins here - ${error.message}`)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
      return response.status(400).send({ error: `Name or number is not valid. ${error.message}`})
    }
    
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})