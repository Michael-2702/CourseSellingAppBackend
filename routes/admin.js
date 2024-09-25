const { Router } = require("express")
const adminRouter = Router()
const bcrypt = require("bcrypt")
const {Admin, Courses } = require("../models/db")
const jwt = require("jsonwebtoken")
const {JWT_ADMIN_SECRET} = require("../config")
const { adminMiddleware } = require("../middlewares/admin")

adminRouter.post("/signup", async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const createdCourses = []
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
            password: hashedPassword,
            createdCourses: []
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
        email: email
    })
    if(!admin){
        res.status(403).json({
            message: "User Doesn't exist"
        })
    }
    else{
        const hashedPassword = await bcrypt.compare(password, admin.password)

        if(admin){
            const token = jwt.sign({
                userId: admin._id
            }, JWT_ADMIN_SECRET)

            res.json({
                token: token
            })
        }
        else{
            res.status(403).json({
                message: "Incorrect credentials"
            })
        }
    }
    
})

adminRouter.post("/course", adminMiddleware, async (req, res) => {
    const adminId = req.userId
    const { title, description, price, ImageUrl, creatorId } = req.body

    const course = await Courses.create({
        title,
        description,
        price,
        ImageUrl,
        creatorId
    })

    const admin = await Admin.findByIdAndUpdate(
        adminId,
        { $addToSet: { createdCourses: course._id } }
    )

    if (!admin) {
        res.status(404).json({ msg: "Admin not found" });
    }

    res.json({
        msg: "course created",
        courseID: course._id
    })
})

adminRouter.get("/courses", adminMiddleware, async (req, res) => {
    const userId = req.userId

    const admin = await Admin.findById(userId)

    if (!admin) {
        res.status(404).json({ msg: "Admin not found" });
    }

    const getCourses = await Courses.find({
        creatorId: userId
    })

    if (getCourses.length === 0) {
        res.status(404).json({ msg: "No courses found for this admin" });
    }

    res.json({
        msg: "Fetched Courses successfully",
        createdCourses: getCourses
    })
})

module.exports = {
    adminRouter
}