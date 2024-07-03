const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/user", (req, res, next) => {
    // check if user is authenticated
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        
        // verify JWT token for user authentication
        jwt.verify(token, "access", (err, user) => {
            // set authenticated user data on the request object and proceed to next middleware
            if (!err) {
                req.user = user;
                next();
            // return error if token verification fails
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
        
    // return error if no access token is found in the session
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
