const validator = require('validator');
const isEmpty= require('./is-empty')
module.exports=function validateProfileInput(data) {
    let errors={}

    data.handle=!isEmpty(data.handle)?data.handle:''
    data.status=!isEmpty(data.status)?data.status:''
    data.skills=!isEmpty(data.skills)?data.skills:''


    if(!validator.isLength(data.handle,{min:2,max:40})){
        errors.handle='用户名长度不能小于2位并且不能大于40位！'
    }
    if (validator.isEmpty(data.handle)){
        errors.handle='handle不能为空！'
    }

    if (validator.isEmpty(data.status)){
        errors.status='职位不能为空！'
    }
    if (validator.isEmpty(data.skills)){
        errors.skills='技能不能为空！'
    }
    if(!isEmpty(data.website)){
        if(!validator.isURL(data.website)){
            errors.website='website不合法！'
        }
    }

    if(!isEmpty(data.tengxunkt)){
        if(!validator.isURL(data.tengxunkt)){
            errors.tengxunkt='website不合法！'
        }
    }
    if(!isEmpty(data.wangyikt)){
        if(!validator.isURL(data.wangyikt)){
            errors.wangyikt='website不合法！'
        }
    }
    return {
        errors,
        isValid:isEmpty(errors)
    }
}