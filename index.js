const express = require("express")
const mongoose = require("mongoose")
const { adminRouter } = require("./routes/admin")
const app = express()

app.use(express.json())

app.use("/api/v1/admin", adminRouter)

async function main() {
    await mongoose.connect("mongodb+srv://admin:123michael456@cluster0.n3tz1.mongodb.net/CourseSelling-App")
    
    app.listen(3000)
}

main()