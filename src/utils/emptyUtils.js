import moment from 'moment'

window.empty = {
    check: function (obj) {
        if (typeof obj === 'number') {
            return true
        }
        if (typeof obj === 'boolean') {
            return obj
        }
        if (typeof obj === 'undefined') {
            return false
        }
        if (typeof obj === '') {
            return false
        }
        if (obj === 'undefined'
            || obj === null
            || obj === []
            || isObjEmpty(obj)) {
            return false
        } else {
            return true
        }
    },
    //获取对象属性值，避免嵌套对象为空报错，用法：empty.getAttr(node_info).node_trace_name，获取node_info.node.trace.name的值
    getAttr: (obj) => {
        let handler = {}
        handler.get = (a, b) => {
            b = b.split('_')
            let self = a
            for (let key of b) {
                let _v = self[key]
                if (_v) {
                    self = _v
                } else {
                    return ''
                }
            }
            return self
        }
        return new Proxy(obj, handler)
    },
    checkEmail: (email) => {
        let reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$') //正则表达式
        if (reg.test(email)) {
            return true
        }
        return false
    },
    checkPhone: (phone) => {
        if (!(/^1[345789]\d{9}$/.test(phone))) {
            return false
        }
        return true
    },
    //检查开始时间是否小于等于结束时间
    checkTime: (start, end) => {
        if (moment(start).format() === moment(end).format())
            return true
        return moment(start).isBefore(end)
    },
    isJsonString: (str) => {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch(e) {
    }
    return false;
}
}
var isObjEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false
    }
    return true
}
