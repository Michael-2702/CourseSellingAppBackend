const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true},
    email: {
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const adminSchema = new Schema({
    username: {type: String, required: true},
    email: {
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const coursesSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    ImageUrl: String,
    creatorId: String
})

const purchases = new Schema({
    userId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId,
})

const User = mongoose.model("user", userSchema)
const Admin = mongoose.model("admin", adminSchema)
const Courses = mongoose.model("courses", coursesSchema)
const Purchases = mongoose.model("purchases", purchases)

module.exports = {
    User,
    Admin,
    Courses,
    Purchases
}