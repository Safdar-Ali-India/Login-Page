import express from "express"
// const express = require("express")
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
//  mongodb://localhost:27017
mongoose.connect("mongodb://127.0.0.1:27017/mylogin").then(() => {
    // console.log("connect");
    // app.listen(5000)
}).then(console.log("connect")).catch((err) => {
    console.log(err);
})
// const connection= async()=>{
//     const connect =await mongoose.connect("mongodb://127.0.0.1:27017/mylogin")
//     console.log("connect");

// }


// mongoose.connect("mongodb://127.0.0.1:27017/mylogin")
// // /myLoginRegisterDB',{
// //     useNewURLParser: true,
// //     useUnifiedTopology: true,
// // }
// ,() =>{
//     console.log("Connected to mongodb")
// });


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
})
const User = new mongoose.model("user", userSchema)
//Routes

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                if (user.password === password) {
                    res.send({ message: "login successful", user: user, status: 1 });
                } 
                else {
                    res.send({ message: "password didn't match", status: 0 });
                }
            } 
            else {
                res.send({ message: "user not registered", status:2});
            }
        })
        .catch((err) => {
            console.log(err);
            res.send({ message: "server error" });
        });
});


app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    console.log(`Registering user with email ${email}...`);
    try {
        const existingUser = await User.findOne({ email });
        console.log(`Existing user: ${existingUser}`);
        if (existingUser) {
            console.log(`User with email ${email} already exists.`);
            return res.send({ message: "User already registered" });
        }
        const user = new User({ name, email, password });
        console.log(`Creating new user: ${user}`);
        await user.save();
        console.log(`New user saved to database.`);
        res.send({ message: "User created" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// })
// console.log("567890");
// res.send(req.body)
app.listen(9002, () => {
    console.log("Server started on port 9002")
})