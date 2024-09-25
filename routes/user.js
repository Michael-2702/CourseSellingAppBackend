const { Router } = require("express")
const userRouter = Router()
const bcrypt = require("bcrypt")
const {User, Courses } = require("../models/db")
const jwt = require("jsonwebtoken")
const {JWT_USER_SECRET} = require("../config")
const { userMiddleware } = require("../middlewares/user")

userRouter.post("/signup", async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const purchases = [];

    try{
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
            return res.status(404).json({
                msg: "Course not found"
            });
        }
    
        const updateResult = await User.findByIdAndUpdate(
            userId,  
            { $addToSet: { purchases: course._id } },  // why addToSET instead of push? -> yeh duplicate entries avoid karta hai just like set DS
        );


        if (!updateResult) {
            return res.status(400).json({
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

module.exports = {
    userRouter
}