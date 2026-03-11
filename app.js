const express = require("express");
const session = require("express-session"); 
const app = express();

app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "it's a secret key",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

const users=[
    {username:"Jack", password:"jack123"},
    {username:"Rose", password:"rose123"}
];


app.get("/",(req,res)=>{
    res.render("index",{ username: req.session.user ? req.session.user.username : null});
});
app.get("/login",(req,res)=>{
    res.render("login",{ error: null });
});
app.post("/login",(req,res)=>{
    const username= req.body.userName;
    const password= req.body.password;
    const user= users.find(user=>user.username === username && user.password===password)
    if(user){
        req.session.user = {username: user.username}
        res.render("index",{username: user.username});
    }else {
        res.render("login",{error: "Invalid username or password. Please try again."});
    }
    
});
app.get("/logout", (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return
        }else{
            res.redirect("/");
        }
    });
});

app.use((req,res)=>{
    res.status(404).render("404");
});

app.listen(process.env.PORT || 8000);