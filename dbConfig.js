const mongoose = require('mongoose');

const connectMong = async () => {
    try {
        const CS = "mongodb+srv://cosme:fulanito@cluster0.cd55fdx.mongodb.net/ecommerce?retryWrites=true&w=majority"
        await mongoose.connect(CS)
        console.log('mongo connected successfully')
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectMong