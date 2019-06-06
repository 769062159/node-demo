const validator = require('validator');
const isEmpty= require('./is-empty')
module.exports=function validatePostInput(data) {
    let errors={}
    data.text=!isEmpty(data.text)?data.text:''


    if (!validator.isLength(data.text,{min:10,max:300})){
        errors.text='内容不能少于10个字符，且不能大于300！'
    }
    if (validator.isEmpty(data.text)){
        errors.text='内容不能为空！'
    }
    return {
        errors,
        isValid:isEmpty(errors)
    }
}