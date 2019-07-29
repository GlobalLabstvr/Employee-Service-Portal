const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const employeeRoutes = require("./routes/employee");


const app = express();

// mangoose.connect("mongodb+srv://User1:" +
//  process.env.MONGO_ATLAS_PW +
//    "@cluster0-ryopy.mongodb.net/employeeInfo_db")
mongoose.connect("mongodb://localhost:27017/employee_db")
.then(() => {
  console.log("Connected to Database");
})
.catch(() => {
  console.log('Connection Failed :'+JSON.stringify(err));
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use("/api/employee", employeeRoutes);

const PORT = 3000;
 app.listen(3000,()=>{
   console.log("Server Running at port:"+PORT);
 });

module.exports = app;
