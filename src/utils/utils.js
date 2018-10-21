import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

// 数组换位置
export function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
   return arr;
}

// 深拷贝
export function deepCopy (source) {
    const result = source.constructor === Array ? [] : {}; // 用三目运算判断他是数组还是对象
    for (const key in source) {
      if (typeof source[key] === 'object') {
        result[key] = deepCopy(source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
};

// 数组去重
export function dedupe(array){
    return Array.from(new Set(array));
}
/**
 * 格式化成指定格式的时间
 * @param {Date} time 时间
 * @return {string} 时间戳
 */
export function correctionTime(time) {
  let times = time.getTime() / 1000;
  let hour = time.getHours();
  hour += 16;
  if (hour > 23) {
    times -= 16 * 60 * 60;
  } else {
    times += 16 * 60 * 60;
  }
  return Number(times);
};

/**
 * 格式化成指定格式的时间
 * @param {Date} time 时间戳
 * @param {string} fmt 格式化的格式
 * @return {string} 格式后的时间
 */
export function timeFormat(time, fmt = 'yyyy-MM-dd hh:mm:ss') {
  time = new Date(time * 1000);
  let o = {
    'M+': time.getMonth() + 1, // 月份
    'd+': time.getDate(), // 日
    'h+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    'S': time.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  }
  return fmt;
};

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

/**
 * @description 比较两个路径是否存在包含关系，输出3就是不包含
 * @param {String} str1 => '/list/search'
 * @param {String} str2 => '/list/search/item'
 * @return => 2
 *
 * @author 何方
 */
function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

/**
 * @description 筛选path，只保留二级菜单的path
 * @param {Array} routes 所有经过 path.replace('/', '')处理后的path路径
 */
function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重  =>去掉item.indexOf(routes[i]) === 0 的元素
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  // 过滤掉根目录 /和没有/的路径
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  /* 获取要呈现的路径以移除深绘制（路径） */
  const renderArr = getRenderArr(routes);
  const renderRoutes = renderArr.map(item => {
    /**
     * *
     * @description 判断是否item有被过滤掉的子元素  list => 'list/search'
     * 有 => !true => false
     * 无 => !false => true
     *
     */
    const exact = !routes.some(route => {
      // item是否存在于routes中,而且不相等  =>list/search.indexOf('/list');
      return route !== item && getRelation(route, item) === 1;
    });
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getHfRoutes(path, routerData) {
  // 过滤掉根目录 /和没有/的路径
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  /* 获取要呈现的路径以移除深绘制（路径） */
//   const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = routes.map(item => {
    //  const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    const exact = true;
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

// 上传玩图
export function uploadJSSDK(config) {

  var file = config.file,
      dir = config.dir || "",
      token = config.token,
      callback = config.callback || function () {},
      retries = config.retries || 0,
      maxSize = config.maxSize || 0,
      configName = config.name||file.name,
      upload_url = "http://upload.media.aliyun.com/api/proxy/upload",
      blockInit = "http://upload.media.aliyun.com/api/proxy/blockInit",
      blockUpload = "http://upload.media.aliyun.com/api/proxy/blockUpload",
      blockComplete = "http://upload.media.aliyun.com/api/proxy/blockComplete",
      chunkSize = config.chunkSize||4 * 1024 * 1024,
      offset = 0,
      blob = file,
      id,  // 上传唯一id，上传初始化请求获得
      uploadId, // 分片上传id，上传初始化请求获得
      tags = [], // 每次分片上传得到的md5
      curChunkSize = [], chunkBlob = []; // 分块上传的各个块

  function handleError(result, finish, chunk, status) {
      // 重试
      if (retries-- > 0 && !finish && status != 599) {
          if (file.size > chunkSize) {
              // 分块上传
              uploadNextChunk(chunk, curChunkSize[chunk], chunkBlob[chunk]);
          } else {
              // 普通上传
              uploadSingle();
          }
      } else {
          callback(-1, result);
      }
  }

  // 上传分块之前需要提交个start请求，上传结束需要提交个finish请求
  function startChunks() {
      var tmp = 0, size;
      while (tmp < blob.size) {
          size = Math.min(chunkSize, blob.size - tmp);
          curChunkSize.push(size);
          chunkBlob.push(blob.slice(tmp, tmp + size));
          tmp += size;
      }
      uploadNextChunk(0, curChunkSize[0], chunkBlob[0])
  }

  function uploadNextChunk(chunk, curchunksize, chunkblob) {
      var formData = new FormData();
      formData.append('size', curchunksize);
      var url;
      if (chunk == 0) {
          formData.append('dir', dir);
          formData.append('name', configName);
          url = blockInit;
      } else {
          formData.append('id', id);
          formData.append('uploadId', uploadId);
          formData.append('partNumber', chunk + 1); //chunk从0开始,partNumber从1开始
          url = blockUpload;
      }
      formData.append('content', chunkblob, blob.name);

      ajax(url, formData, function (e) {
          var status = e.status,
              message = e.statusText || "";
          if (status == 200 && message == "OK") {
              var result = JSON.parse(e.responseText);
              tags[chunk] = result.eTag;
              offset += curchunksize;

              var percent = Math.ceil(offset / file.size * 100);
              //改变显示的中间状态
              callback(percent);

              if (chunk == 0) {
                  id = result.id;
                  uploadId = result.uploadId;
                  for (var i = 1; i < chunkBlob.length; i++) {
                      uploadNextChunk(i, curChunkSize[i], chunkBlob[i])
                  }
              }

              // Check if file is uploaded
              if (offset >= blob.size) {
                  blob = null;
                  chunkblob = formData = null; // Free memory
                  finishChunks();
              }
          } else {
              handleError(JSON.parse(e.responseText), 0, chunk, status);
          }
      });
  }

  function finishChunks() {
      var parts = [];
      for (var i = 0; i < tags.length; i++) {
          parts[i] = {
              "partNumber": i + 1,
              "eTag": tags[i]
          }
      }
      parts = btoa(JSON.stringify(parts));
      var formData = new FormData();
      formData.append('id', id);
      formData.append('uploadId', uploadId);
      formData.append('parts', parts);

      ajax(blockComplete, formData, function (e) {
          var status = e.status,
              message = e.statusText || "";
          if (status == 200 && message == "OK") {
              callback(100, JSON.parse(e.responseText));
          } else {
              handleError(JSON.parse(e.responseText), 1, "", status);  //分片上传已经完成就不能重试了
          }
      })
  }

  function uploadSingle() {
      var formData = new FormData();
      formData.append('dir', dir);
      formData.append('name', configName);
      formData.append('size', file.size);
      formData.append('content', file);
      var url = upload_url;

      ajax(url, formData, function (e) {
          var status = e.status,
              message = e.statusText || "";
          if (status == 200 && message == "OK") {
              callback(100, JSON.parse(e.responseText));
          } else {
              handleError(JSON.parse(e.responseText), "", "", status);
          }
      });
  }

  function ajax(url,data,complete){
      var request = new XMLHttpRequest();
      var query = 'Authorization=' + token + '&UserAgent=ALIMEDIASDK_WORKSTATION';
      if(url.indexOf('?') > -1){
          url += '&' + query;
      }else{
          url += '?' + query;
      }
      request.open('POST', url);
      
      request.onload = function(e) {
          complete(request);
      };
      request.send(data);
  }

  if (!file || !token) {
      callback(-1, '上传文件参数必须配置file以及token');
      return;
  }

  if (maxSize && file.size > maxSize) {
      callback(-1, "文件大小不能超过"+maxSize);
      return;
  }

  if (file.size > chunkSize) {
      // 分块上传
      startChunks();
  } else {
      // 普通上传
      uploadSingle();
  }
}
