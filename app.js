//jshint esversion:6
require('dotenv').config()
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs");
const encrypt=require("mongoose-encryption")
const { default: mongoose } = require("mongoose");
const app=express();

 console.log(process.env.apikey);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true})

const userSchema=new mongoose.Schema({
    username:String,
    password:String
})

  const secret=process.env.SECRET
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["username","password"]});


const User=mongoose.model("user",userSchema)



app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){

    const email=req.body.username
    const password=req.body.password

    const newUser=new User({
        username:email,
        password:password
    })

    newUser.save().then(()=>{
        res.render("secrets")
    })
    .catch((err)=>{
        console.log(err)
    })


})

app.post("/login",function(req,res){
    const email=req.body.username
    const password=req.body.password

    User.findOne({username:email}).then((found)=>{
        if(found.password===password){
            res.render("secrets")
        }else{
            res.render("register")
        }
    })
})

app.listen(3000,function(){
    console.log("Server started on port 3000");
});