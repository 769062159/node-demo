const validator = require('validator');
const isEmpty= require('./is-empty')
module.exports=function validateEducationInput(data) {
    let errors={}
    data.school=!isEmpty(data.school)?data.school:''
    data.degree=!isEmpty(data.degree)?data.degree:''
    data.fieldofstudy=!isEmpty(data.fieldofstudy)?data.fieldofstudy:''
    data.from=!isEmpty(data.from)?data.from:''


    if (validator.isEmpty(data.school)){
        errors.school='学校不能为空！'
    }

    if (validator.isEmpty(data.degree)){
        errors.degree='学历不能为空！'
    }
    if (validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy='专业不能为空！'
    }
    if (validator.isEmpty(data.from)){
        errors.from='工作时间不能为空！'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}