// imports mongoose module
const mongoose = require('mongoose')

// stops process if no args passed via command-line
if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

// definitions
const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]
const url = `mongodb+srv://newuser:${password}@cluster0-fn8a4.mongodb.net/phonebook-app?retryWrites=true&w=majority`

// connect to mongo DB using link stored in url variable
mongoose.connect(url, { useNewUrlParser: true })

// a schema is created - the template of the document collection items
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// from the schema, a model is generated. a constructor that makes js objects from input that also have mongoose methods
const Contact = mongoose.model('Contact', contactSchema)

// if only three args passed (node mongo.js password) prints list of contacts in DB
if ( process.argv.length == 3 ) {
  Contact.find({}).then(result => {
    console.log('phonebook')
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
  })
  mongoose.connection.close()
})

} 

else if ( process.argv.length == 5 ) {
// add contact to DB
let contact = new Contact({
  name: `${contactName}`,
  number: `${contactNumber}`,
})
contact.save().then(response => {   
  console.log(`Added ${contact.name} number ${contact.number} to phonebook`)
  mongoose.connection.close()
})

}