const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Successfuly connected to MongoDB');
    } catch (err) {
        console.error(err);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
 