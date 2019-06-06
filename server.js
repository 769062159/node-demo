const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport =require('passport')

const app = express()

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')
//db config
const db=require("./config/keys").mongoURI

//使用bodyparser

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



//连接数据库
mongoose.connect(db).then(()=>{
    console.log('db connected')
}).catch((err)=>{
    console.log(err)
})

//使用中间件实现允许跨域

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers","Content-Type")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    next()
})

//passport初始化
app.use(passport.initialize());
require('./config/passport')(passport)



//使用routes
app.use('/api/users',users)
app.use('/api/profile',profile)
app.use('/api/post',posts)

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`port ${port}`)
})