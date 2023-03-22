const express=require('express')
const bodyParser=require('body-parser')
const router = require('./router')
const route=express.Router()

route.use(bodyParser.json())
route.use(bodyParser.urlencoded({ extended: false }));




// module.exports=route;


// const cookieParser = require('cookie-parser');
// const session = require('express-session');

// route.use(cookieParser());
// route.use(session({
//   secret: 'mysecretkey',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: false, // Set to true if using HTTPS
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));