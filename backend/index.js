import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import route from './routes.js'
import cors from 'cors'
import session from "express-session"

const app=new express();
dotenv.config();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend domain
    credentials: true, // Allow credentials
}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
}));

const PORT=process.env.PORT||5000
const MONGODB_URL=process.env.MONGO_URL
mongoose.connect(MONGODB_URL).then(()=>{
    console.log("Database Connected Successfully")
})
app.listen(PORT,()=>{
    console.log(`Server is Connnected To Port ${PORT}`)
})

app.use("/api/product",route)