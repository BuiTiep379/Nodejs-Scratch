const mongoose = require('mongoose');

const connectDB = async (url) => {
    try {
        await mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`MongoDB conneted success`);
      } catch (error) {
        console.log('MongoDB conneted failed');
        process.exit(1);
      }
};

module.exports = connectDB;