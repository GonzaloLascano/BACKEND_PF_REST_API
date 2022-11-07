const mongoose = require('mongoose')

const usersCollectionName = 'users'

const usersMongoSchema = new mongoose.Schema({
    realname: {
        type: String, 
        maxLength: [40, 'Full name is too long, can you make it shorter?'], 
        required: [true, 'User real name needed'],
    },
    email: {
        type: String, 
        match: [/[\w-.]+@+\w+[.]+com/, 'The email does not match the requested format'], 
        required: [true, 'Please insert an email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is needed'],
    },
    assignedChartId: String,
    phone: {
        type: Number,
        maxLength: [16, 'the number cant have more than 16 digits']
    },
    admin: Boolean
})

const UsersMongoModel = mongoose.model(usersCollectionName, usersMongoSchema)

module.exports = { UsersMongoModel }