require("dotenv").config();
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const connectDB  = require('./server/config/db');
const session  = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const app = express();
const PORT = 2000 || process.env.PORT;

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    store : MongoStore.create({
        mongoUrl:process.env.MONGODB_URI,
    }),
    // cookie: {
    //     maxAge: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
    // }
}));

app.use(passport.initialize());
app.use(passport.session());


// MIDDLEWARE FOR TRANSFER DATA FROM PAGE TO ANOTHER
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method")); // To allow put method to update something


// STATIC FILES
app.use(express.static('public'));  

  

// TEMPLATING ENGINE
app.use(expressEjsLayouts);
app.set("layout" , './layouts/main');
app.set("view engine" , 'ejs');


app.use('/' , require('./server/routes/auth'));
app.use('/' , require('./server/routes/main'));
app.use('/' , require('./server/routes/dashboard'));

// Handle 404
app.get('*' , (req,res)=>{
    res.status(404).render('404');
});



// Connect database
connectDB().then(
    app.listen(PORT , ()=>{
        console.log("App is running on " , PORT);
}));