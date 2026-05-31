const express = require("express");
const DBConnect = require("./config/DbConfig");
const app = express();
app.use(express.json());

DBConnect();

app.listen(3000,()=>{
    console.log("server started")
});