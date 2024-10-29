const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { nanoid } = require('nanoid')
const link = require("./models/links");
const engine = require('ejs-mate');
const url = require('url');

const app = express();
mongoose.connect('mongodb://localhost:27017/shortenedLinks', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("db connection success"))
    .catch(() => console.log(" db connection error"))


app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))


app.get("/", (req, res)=>{    
    res.render("home");
})

app.get("/user/", (req, res)=>{
    const {user} = req.query;     
    res.redirect(`/user/${user}`);
})

app.get("/user/:user", async (req, res)=>{

    const {user} = req.params;
    const domain = req.protocol + '://' + req.get('host');   

    try
    {
        const userExists = await link.findOne({username: user});
        if(userExists){
            try{
                const data = await link.find({username: user});                
                res.render("user", {data, user, domain});
            }
            catch(e){
                res.render("err");
            }
        }
        else{
            res.render("404");
        }

    }
    catch(e){res.render("err")}

    
})

app.get("/:id", async (req, res)=>{
    const {id} = req.params;
    
    try
    {
        const goto = await link.findOne({shortenedLink: id});
        if(!goto){
            res.render("404");
        }
        else{
            res.redirect(goto.redirectTo);
        }
    }
    catch (e){
        res.render("err");
    }    

})

app.post("/", async (req, res) =>{

    const {url, username} = req.body;     

    if(!url){        
        res.redirect("/");
    }
    
    try{
        const found = await link.findOne({redirectTo: url, username: username});
        if (found){
            res.redirect(`/user/${username}`);
        }
        else{
            try{
                const newLink = new link({shortenedLink: nanoid(10), redirectTo: url, dateCreated: new Date(), username: username});
                await newLink.save();        
                res.redirect(`/user/${username}`);
            } catch (e) {res.render("err")}
        }
    }
    catch (e) {res.render("err")}
    
    
})

app.use((req, res, next)=>{
    res.render("404");
    next();
})


app.listen(3000, ()=>{
    console.log("Sever started at port 3000");
})
