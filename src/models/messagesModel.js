const mongoose = require('mongoose')

const messagesCollectionName = 'messages'

const messageMongoSchema = new mongoose.Schema({
    customer: Boolean,
    timestamps: true,
    email: {
        type: String, 
        match: [/[\w-.]+@+\w+[.]+com/, 'The email does not match the requested format'], 
        required: [true, 'Please insert an email address'],
    },
    body: {
        type: String,
        maxLength: [500, 'Message longer than 500 characters'], 
        required: [true, 'Please insert a message']
    }
})

const MessageMongoModel = mongoose.model(messagesCollectionName, messageMongoSchema)

module.exports = { MessageMongoModel }