const validator = require('validator');
const isEmpty= require('./is-empty')
module.exports=function validateExperienceInput(data) {
    let errors={}
    data.title=!isEmpty(data.title)?data.title:''
    data.company=!isEmpty(data.company)?data.company:''
    data.from=!isEmpty(data.from)?data.from:''


    if (validator.isEmpty(data.title)){
        errors.title='个人经历title不能为空！'
    }

    if (validator.isEmpty(data.company)){
        errors.company='公司不能为空！'
    }
    if (validator.isEmpty(data.from)){
        errors.from='工作时间不能为空！'
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