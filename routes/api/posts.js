const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Profile = require('../../modules/Profiles')

const Post = require('../../modules/Posts')
const passport = require('passport')
const validatePostInput=require('../../validation/post')

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid }=validatePostInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }
    const newPost=new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    })
    newPost.save().then(post=>{res.json(post)})
    // Post.findOne({user:req.user.id})


})

router.get('/',(req,res)=>{
    Post.find()
        .sort({date:-1})
        .then(post=>{res.json(post)})
        .catch(err=>res.status(404).json({nopostFound:'找不到评论信息！'}))
})
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{res.json(post)})
        .catch(err=>res.status(404).json({nopostFound:'找不到评论信息！'}))
})
router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        Post.findById(req.params.id).then(post=>{
            if(post.user.toString()!==req.user.id){
                return res.status(401).json({no:'非法操作！'})
            }
            post.remove().then(()=>{
                res.json({success:true})
            }).catch(err=>{
                res.status(404).json({nopostFound:'没有该评论！'})
            })
        })
    })
})
router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        Post.findById(req.params.id).then(post=>{
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
                return res.status(400).json({alreadyLike:'已经赞过！'})
            }
            post.likes.unshift({user:req.user.id})
            post.save().then(post=>res.json(post)).catch(err=>res.json({liked:'like error'}))
        })
    })
})
router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        Post.findById(req.params.id).then(post=>{
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
                return res.status(400).json({alreadyLike:'没有点赞！'})
            }
            const removeIndex=post.likes.map(item=>item.user.toString()).indexOf(req.user.id)
            post.likes.splice(removeIndex,1)
            post.save().then(post=>res.json(post)).catch(err=>res.json({liked:'like error'}))
        })
    })
})
/**
 * 添加评论
 */
router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
   Post.findById(req.params.id).then(post=>{
       const newComment={
           text:req.body.text,
           name:req.body.name,
           avatar:req.body.avatar,
           user:req.user.id
       }
       post.comments.unshift(newComment)
       post.save().then(post=>res.json(post)).catch(err=>res.status(404).json({error:'error'}))
   })
})

router.delete('/uncomment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id).then(post=>{
        if(post.comments.filter(comment=>comment._id.toString()===req.params.comment_id)){
            return res.status(404).json({error:'评论不存在！'})
        }
        const removeIndex=post.comments.map(item=>item._id.toString().indexOf(req.params.comment_id))
        post.comments.splice(removeIndex,1)
        post.save().then(post=>res.json(post)).catch(err=>res.status(404).json({error:'删除评论错误'}))
    })
})
module.exports = router;