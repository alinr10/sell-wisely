import express from 'express';
import conn from './db.js';
import dotenv from 'dotenv'
import UserModel from './src/models/User.js'
import bcrypt from 'bcrypt'
import userRoute from './src/routes/userRoute.js';
import cookieParser from 'cookie-parser';

import MongoStore from 'connect-mongo';
import multer from 'multer';
import path from 'path';
dotenv.config()

const app = express()
const port = 3001



const storage = multer.diskStorage({
  destination: '../frontend/public/uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
app.use(upload.single('profilePhoto'));






app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST ,PUT,DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-access-token");
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});


app.use(cookieParser())

app.use(express.json())

conn()

app.use('/user', userRoute);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})