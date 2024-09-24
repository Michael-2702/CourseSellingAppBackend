require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const { adminRouter } = require("./routes/admin")
const { userRouter } = require("./routes/user")
const app = express()

app.use(express.json())

app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/user", userRouter)

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    
    app.listen(3000)
}

main()