// db.js
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const atlas = "mongodb+srv://tritopyan:h347PTMK91aGUKIr@cluster0.l2xcw1q.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(atlas);
    console.log("✅ Connect success");
  } catch (error) {
    console.log("❌ Connect fail");
    console.error(error);
  }
};

module.exports = connectDB;
