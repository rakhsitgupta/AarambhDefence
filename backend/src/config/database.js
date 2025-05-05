const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGODB_URL = 'mongodb+srv://aarambh_backend_user_khushi:Opo8rFTgnluu5YvK@cluster0.yf7ky.mongodb.net/aarambhDB?retryWrites=true&w=majority&appName=Cluster0';
        const conn = await mongoose.connect(MONGODB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB }; 