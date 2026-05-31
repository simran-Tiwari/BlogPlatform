const mongoose = require("mongoose");


const DBConnect = async()=>{
    try{
        await (mongoose.connect(process.env.DB_URL));
        console.log("connected to DB")
    }catch(e){
        console.log("connection error", e);
    }
}

module.exports = DBConnect;