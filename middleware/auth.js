const jwt = require("jsonwebtoken")
const Register = require("../models/registers");

const auth = async (req, res, next) => {
    try {
        // console.log("before");
        // console.log(req.auth);
        // console.log("after");
        const token = req.cookies.jwt;
        console.log("token value is : " + token);
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        const user = await Register.findOne({ _id: verifyUser._id });
        console.log(user);
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send(err);
    }
}

module.exports = auth;