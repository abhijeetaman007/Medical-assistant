import express from "express"
const app = express()
import {connectMongo} from "./src/config/mongo.js"
connectMongo()
const port = 5000

//Routes


console.log("hello")


app.listen(port, () => console.log(`Listening on port ${port}`))