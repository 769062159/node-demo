const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Profile = require('../../modules/Profiles')
const User = require('../../modules/User')
const passport = require('passport')
const validateProfileInput =require('../../validation/profile')
const validateExperienceInput=require('../../validation/experience')
const validateEducationInput=require('../../validation/education')
router.get('/test',(req,res)=>{
    res.json({
        msg:'profile works'
    })
})

router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={}
    Profile.findOne({user:req.user.id})
        .populate('user',['name','avatar'])
        .then((profile)=>{
        if(!profile){
            errors.noProfile='该用户信息不存在！'
            return res.status(404).json(errors)
        }
        return res.json(profile)
    }).catch(err=>{
        res.status(404).json(err)
    })
})

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid }=validateProfileInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    const profileFields={}
    profileFields.user=req.user.id
    if(req.body.handle){
        profileFields.handle=req.body.handle
    }
    if(req.body.company){
        profileFields.company=req.body.company
    }
    if(req.body.website){
        profileFields.website=req.body.website
    }
    if(req.body.location){
        profileFields.location=req.body.location
    }
    if(req.body.status){
        profileFields.status=req.body.status
    }
    if(req.body.bio){
        profileFields.bio=req.body.bio
    }
    if(req.body.githubusername){
        profileFields.githubusername=req.body.githubusername
    }
    //skills数组转换
    if(typeof req.body.skills!=="undefined"){
        profileFields.skills=req.body.skills.split(",")
    }

    profileFields.social={}

    if(req.body.wechat){
        profileFields.social.wechat=req.body.wechat
    }
    if(req.body.QQ){
        profileFields.social.QQ=req.body.QQ
    }
    if(req.body.tengxunkt){
        profileFields.social.tengxunkt=req.body.tengxunkt
    }
    if(req.body.wangyikt){
        profileFields.social.wangyikt=req.body.wangyikt
    }

    Profile.findOne({user:req.user.id}).then(profile=>{
        if(profile){
            //用户信息存在执行更新方法
            Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true}).then(profile=>{
                res.json(profile)
            })
        }else{
            //不存在执行创建方法
            Profile.findOne({handle:profileFields.handle}).then(profile=>{
                if(profile){
                    errors.handle='该用户个人信息已经存在，请勿重新创建'
                    res.status(400).json(errors)
                }
                new Profile(profileFields).save().then(profile=>{
                   res.json(profile)
                })
            })
        }
    })
})
/**
 * 通过handle获取个人信息
 */
router.get('/handle/:handle',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={}
    Profile.findOne({handle:req.params.handle})
        .populate("user",['name','avatar'])
        .then(profile=>{
            if(!profile){
                errors.noProfile="未找到用户信息"
                res.status(404).json(errors)
            }
            res.json(profile)
        }).catch(err=>res.status(404).json(err))
})
/**
 * 通过userId查询个人信息
 */
router.get('/user/:user_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={}
    Profile.findOne({user:req.params.user_id})
        .populate("user",['name','avatar'])
        .then(profile=>{
            if(!profile){
                errors.noProfile="未找到用户信息"
                res.status(404).json(errors)
            }
            res.json(profile)
        }).catch(err=>res.status(404).json(err))
})
/**
 * 获取所有用户信息
 * @type {Router|router}
 */
router.get('/all',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={}
    Profile.find()
        .populate("user",['name','avatar'])
        .then(profiles=>{
            if(!profiles){
                errors.noProfile="未找到任何用户信息"
                res.status(404).json(errors)
            }
            res.json(profiles)
        }).catch(err=>res.status(404).json(err))
})
/**
 * 添加个人经历
 */
router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid }=validateExperienceInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            const newExp={
                title:req.body.title,
                company:req.body.company,
                location:req.body.location,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                description:req.body.description
            }
            profile.experience.unshift(newExp)
            profile.save().then(profile=>{
                res.json(profile)
            })
        })
})
/**
 * 删除个人经历
 */
router.delete('/experience/:epx_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            const removeIndex=profile.experience
                .map(item=>item.id)
                .indexOf(req.params.epx_id)
            profile.experience.splice(removeIndex,1)
            profile.save().then(profile=>{
                res.json(profile)
            }).catch(err=>res.status(404).json(err))
        })
})
/**
 * 添加教育经历
 */
router.post('/education',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid }=validateEducationInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            const newEdu={
                school:req.body.school,
                degree:req.body.degree,
                fieldofstudy:req.body.fieldofstudy,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                description:req.body.description
            }
            profile.education.unshift(newEdu)
            profile.save().then(profile=>{
                res.json(profile)
            })
        })
})


/**
 * 删除教育经历
 */
router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            const removeIndex=profile.education
                .map(item=>item.id)
                .indexOf(req.params.edu_id)
            profile.education.splice(removeIndex,1)
            profile.save().then(profile=>{
                res.json(profile)
            }).catch(err=>res.status(404).json(err))
        })
})

/**
 * 删除用户信息
 */
router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOneAndRemove({user:req.user.id})
        .then(()=>{
            User.findOneAndRemove({_id:req.user.id})
                .then(()=>{
                    res.json({success:true})
                })
        })
})

module.exports = router;