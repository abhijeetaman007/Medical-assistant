//connect DB
// import { store, connectMongo } from "./config/mongo"
const connectMongo = require("./src/config/mongo")
connectMongo()

const express = require('express')
const app = express()

console.log("hello")

const port = 5000
const session = require("express-session")
const bodyParser = require("body-parser")


app.listen(port, () => console.log(`Listening on port ${port}`))