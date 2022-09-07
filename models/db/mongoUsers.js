const mongoose = require('mongoose')

const usersCollectionName = 'users'

const usersMongoSchema = new mongoose.Schema({
    email: String,
    password: String,
    realname: String,
    address: String,
    age: Number,
    phone: Number,
    photo: String
})

const UsersMongoModel = mongoose.model(usersCollectionName, usersMongoSchema)

module.exports = { UsersMongoModel }