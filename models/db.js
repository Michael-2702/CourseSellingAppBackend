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
    purchases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    }]
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
    createdCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    }]
})

const coursesSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    ImageUrl: String,
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
})

// const purchases = new Schema({
//     userId: [{
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User'
//     }], 
//     courseId: [{
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Course'
//     }]
// })

const User = mongoose.model("user", userSchema)
const Admin = mongoose.model("admin", adminSchema)
const Courses = mongoose.model("courses", coursesSchema)
// const Purchases = mongoose.model("purchases", purchases)

module.exports = {
    User,
    Admin,
    Courses,
    // Purchases
}