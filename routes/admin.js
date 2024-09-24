const { Router } = require("express")
const adminRouter = Router()
const bcrypt = require("bcrypt")
const {Admin, Courses } = require("../models/db")

adminRouter.post("/signup", async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

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
})

module.exports = {
    adminRouter
}