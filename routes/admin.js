const { Router } = require("express")
const adminRouter = Router()
const bcrypt = require("bcrypt")
const {Admin, Courses } = require("../models/db")
const jwt = require("jsonwebtoken")
const {JWT_ADMIN_SECRET} = process.env.JWT_ADMIN_SECRET

adminRouter.post("/signup", async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    try{
        const existingUser = await Admin.findOne({
            email: email
        })
    
        if(existingUser){
            res.json({
                message: "User Already Exists"
            })
        }
    
        const hashedPassword = await bcrypt.hash(password, 3)
    
        await Admin.create({
            username: username,
            email: email,
            password: hashedPassword
        })
    
        res.json({
            message: "Signed Up"
        })
    }
    catch(e){
        console.log(e)
    }
   
})

adminRouter.post("/signin", async (req, res) => {
    const {email, password} = req.body;

    const admin = await Admin.findOne({
        email,
        password
    })

    if(admin){
        const token = jwt.sign({
            userId: admin._id.toString()
        }, JWT_ADMIN_SECRET)

        res.json({
            token: token
        })
    }
    else{
        res.json({
            msg: "Incorrect Creds"
        })

    }
})

module.exports = {
    adminRouter
}