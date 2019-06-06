//login & register

const express = require("express")
const router = express.Router()
const bcrypt= require('bcrypt')
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../../modules/User')
const keys=require('../../config/keys')
const passport = require('passport')
//引入验证方法
const validateRegisterInput=require('../../validation/register')
const validateLoginInput=require('../../validation/login')

//route GET api/users/test
router.get('/test',(req,res)=>{
    res.json({msg:"login works"})
})

router.post('/register',(req,res)=>{

    const { errors, isValid }=validateRegisterInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }
    //查询数据库中是否拥有邮箱
    User.findOne({
        email:req.body.email
    }).then((user)=>{
        if(user){
            return res.status(400).json({emial:'邮箱已经被注册！'})
        }else{
            const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const newUser=new User({
                name:req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password
            })
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash)=> {
                    // Store hash in your password DB.
                    if(err) throw  err;
                    newUser.password=hash;
                    newUser.save().then(user=>{
                        res.json(user)
                    }).catch(err=>console.log(err))
                });
            });
        }
    })

})

router.post('/login',(req,res)=>{
    const { errors, isValid }=validateLoginInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    const email=req.body.email
    const password=req.body.password
    //查询数据库
    User.findOne({
        email
    }).then(user=>{
        if(!user){
            return res.status(404).json({email:"用户不存在！"})
        }
        //密码匹配
        bcrypt.compare(password, user.password).then((isMatch)=> {
            if(isMatch){
                const rule={id:user.id,name:user.name}

                //参数规则，加密名称，过期时间，箭头函数
                jwt.sign(rule,keys.secretOrKey,{expiresIn: 3600},(err,token)=>{
                    if(err)throw err
                    res.json({
                        success:true,
                        token:'Bearer '+token
                    })
                })
            }else{
                return res.status(400).json({
                    password:'密码错误！'
                })
            }
        });
    })
})

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
    })
})

module.exports=router