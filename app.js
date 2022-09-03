//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["password"]});


const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
})

app.get("/register",function(re,res){
    res.render("register");
})

app.get("/login",function(re,res){
    res.render("login");
})

app.post("/register",function(req,res){

    const email = req.body.username;
    const password = req.body.password;

    const user = new User({
        email:email,
        password: password
    })

    user.save(function(err){
        if(!err){
            res.render("secrets")
        }else{
            console.log(err);
        }
    })
     
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,foundUser){
        if(foundUser){
            if(foundUser.password === req.body.password){
                res.render("secrets");
            }else{
                console.log("Not Login yet");
            }
        }
    })
})


app.listen(3000,function(req,res){
    console.log("Listenning to port 3000");
})
