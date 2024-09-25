const { Router } = require("express")
const userRouter = Router()
const bcrypt = require("bcrypt")
const { User, Courses } = require("../models/db")
const jwt = require("jsonwebtoken")
const {JWT_USER_SECRET} = require("../config")
const { userMiddleware } = require("../middlewares/user")
const { z } = require("zod")

userRouter.post("/signup", async (req, res) => {

    try{
        const mySchema = z.object({
            username: z.string(),
            email: z.string().email().min(6),
            password: z.string()
                .min(8, "Password Should be of atleast 8 characters")
                .max(100, "Password Should not exceed 100 characters")
                .regex(/[a-z]/, "Password must contain atleast 1 lowercase letter")
                .regex(/[A-Z]/, "Password must contain atleast 1 uppercase letter")
                .regex(/[0-9]/, "Password must contain atleast 1 number")
                .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 special character")
        }).strict({
            messageg: "Extra Fields not allowed"
        })
    
        const response = mySchema.safeParse(req.body)
    
        if(!response.success){
            res.status(411).json({
                msg: "Incorrect Format",
                error: response.error.errors
            })
        }
    
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const purchases = [];
        
        const existingUser = await User.findOne({
            email: email
        })
    
        if(existingUser){
            res.json({
                message: "User Already Exists"
            })
        }
    
        const hashedPassword = await bcrypt.hash(password, 3)
    
        await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            purchases: purchases
        })
    
        res.json({
            message: "Signed Up"
        })
    }
    catch(e){
        console.log(e)
    }
   
})

userRouter.post("/signin", async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({
            email: email
        })
        
        if(!user){
            res.status(403).json({
                message: "User Doesn't exist"
            })
        }
        else{
            const hashedPassword = await bcrypt.compare(password, user.password)
    
            if(user){
                const token = jwt.sign({
                    userId: user._id
                }, JWT_USER_SECRET)
    
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
    }
    catch(e){
        console.log(e)
    }
})

userRouter.put("/purchase", userMiddleware, async (req, res) => {
    const userId = req.userId
    const courseId = req.body.courseId;

    try{
        const course = await Courses.findById({
            _id: courseId
        })

        if (!course) {
            res.status(404).json({
                msg: "Course not found"
            });
        }
    
        const updateResult = await User.findByIdAndUpdate(
            userId,  
            { $addToSet: { purchases: course._id } },  // why addToSET instead of push? -> yeh duplicate entries avoid karta hai just like set DS
        );

        if (!updateResult) {
            res.status(400).json({
                msg: "Failed to purchase the course"
            });
        }
        

        res.json({
            msg: "Course purchased",
            purchasedCourses: course.title 
        })
    }
    catch(e){
        console.log(e)
    }
})

userRouter.get("/allCourses", async (req, res) => {
    const courses = await Courses.find({})

    res.json({
        msg: "All courses are Fetched",
        courses
    })
})


userRouter.get("/courses", userMiddleware, async (req, res) => {
    const userId = req.userId

    const user = await User.findOne({
        _id: userId
    })

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    if (!user.purchases || user.purchases.length === 0) {
        return res.status(404).json({ msg: "No purchases found for this user" });
    }

    const courses = await Courses.find({
        _id: { $in: user.purchases }
    })

    if(courses.length == 0){
        res.status(404).json({
            msg: "Course not found"
        })
    }

    res.json({
        msg: "Fetched courses succesfully",
        courses: courses
    })
})

module.exports = {
    userRouter
}