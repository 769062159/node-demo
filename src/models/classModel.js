// import { routerRedux } from 'dva/router';
import { addClass, classList, deleteClass, searchClass, updateClass } from '../services/class';
import { swapArray } from '../utils/utils';

export default {
  namespace: 'classModel',

  state: {
    classList: [],
    classListPage: {},
    editClass: {},
    classForm: {
      xxx: [],
      yyy: [],
      keys: [],
      list: [],
    },
  },

  effects: {
    *searchClass({ payload }, { call, put }) {
      const response = yield call(searchClass, payload);
      yield put({
        type: 'setClass',
        payload: response,
      });
    },
    *deleteClass({ payload, callback, page }, { call, put }) {
      const response = yield call(deleteClass, { course_id: payload });
      if (response && response.code === 200) {
        callback();
        const res = yield call(classList, page);
        yield put({
          type: 'getclassLists',
          payload: res,
        })
      }
    },
    *editClass({ payload, callback }, { call }) {
      const response = yield call(updateClass, payload.data);
      if (response && response.code === 200) {
        callback();
      }
    },
    *addClass({ payload, callback }, { call, put }) {
      const response = yield call(addClass, payload.data);
      if (response && response.code === 200) {
        callback();
        yield put({
          type: 'clearClassForm',
        });
      }
    },
    *getclassList({ payload, callback }, { call, put }) {
      const response = yield call(classList, payload);
      if (callback && response && response.code === 200) {
        const arr = [];
        response.data.list.forEach(res => {
          if (res.is_check_live) {
            arr.push(res.id);
          }
        })
        callback(arr);
      }
      yield put({
        type: 'getclassLists',
        payload: response,
      })
    },
  },

  reducers: {
    setClass(state, { payload }) {
      // const { data: { detail, cover, share_cover: shareCover, has_lessons: lessons, title, desc } } = payload;
      const { data } = payload;
      const { detail, cover, share_cover: shareCover, has_lessons: lessons, title, desc } = data;
      const editClass = data || {};
      const classForm = {
        detail,
        title,
        desc,
        xxx: [],
        yyy: [],
      }
      if (cover) {
        classForm.xxx = [{
          status: 'done',
          uploaded: 'done',
          response: { status: 'success', data: cover },
          name: cover,
          uid: cover,
          url: cover,
        }];
      }
      if (shareCover) {
        classForm.yyy = [{
          status: 'done',
          uploaded: 'done',
          response: { status: 'success', data: shareCover },
          name: shareCover,
          uid: shareCover,
          url: shareCover,
        }];
      }
      const keys = [];
      const list = [];
      lessons.forEach((res, index) => {
        keys.push( `url${index}`, `price${index}`, `vtype${index}`, `vodTitle${index}`);
        const obj = {};
        obj.price = res.price;
        obj.type = res.type;
        if (res.type === 3) {
          obj.vtype = 1;
          obj.url = res.tencent_video_url;
          classForm[`vtype${index}`] = 1;
          classForm[`url${index}`] = res.tencent_video_url;
        } else if (res.type === 0) {
          obj.vtype = 0;
          obj.vod_id = res.stv_vod_id;
          obj.vodTitle = res.vod_title;
          classForm[`vtype${index}`] = 0;
          classForm[`vodTitle${index}`] = res.vod_title;
        } else {
          obj.vtype = 0;
          obj.vodTitle = res.video_url;
          classForm[`vtype${index}`] = 0;
          classForm[`vodTitle${index}`] = res.video_url;
        }
        classForm[`price${index}`] = res.price;
        list.push(obj);
      })
      classForm.keys = keys;
      classForm.list = list;
      return {
        ...state,
        classForm,
        editClass,
      };
    },
    setVodId(state, { payload }) {
      const { index, id, title, type } = payload;
      const { classForm } = state;
      classForm.list[index].vod_id = id;
      classForm.list[index].type = type;
      classForm.list[index].vodTitle = title;
      if (classForm.keys.indexOf(`vodTitle${index}`) === -1) {
        classForm.keys.push(`vodTitle${index}`);
      }
      classForm[`vodTitle${index}`] = title;
      return {
        ...state,
        classForm,
      };
    },
    setVodurl(state, { payload }) {
      const { index, url, type } = payload;
      const { classForm } = state;
      classForm.list[index].type = type;
      classForm.list[index].vodTitle = url;
      classForm[`vodTitle${index}`] = url;
      if (classForm.keys.indexOf(`vodTitle${index}`) === -1) {
        classForm.keys.push(`vodTitle${index}`);
      }
      return {
        ...state,
        classForm,
      };
    },
    setVideoId(state, { payload }) {
      const { index, id, title, type } = payload;
      const { classForm } = state;
      classForm.list[index].vod_id = id;
      classForm.list[index].type = type;
      classForm.list[index].vodTitle = title;
      classForm[`vodTitle${index}`] = title;
      if (classForm.keys.indexOf(`vodTitle${index}`) === -1) {
        classForm.keys.push(`vodTitle${index}`);
      }
      return {
        ...state,
        classForm,
      };
    },
    getclassLists(state, { payload }) {
      const { data } = payload;
      const { list, total, page } = data;
      return {
        ...state,
        classList: list,
        classListPage: {
          pageSize: page,
          total,
        },
      };
    },
    clearClassForm(state) {
      return {
        ...state,
        classForm: {
          xxx: [],
          yyy: [],
          keys: [],
          list: [],
        },
      };
    },
    removeForm(state, { payload }) {
      const { index } = payload;
      const { classForm: { title, xxx, list, yyy, desc, detail } } = state;
      list.splice(index, 1);
      const data = {
        title,
        xxx,
        yyy,
        desc,
        detail,
        list: [],
        keys: [],
      };
      list.forEach((ele, index) => {
        // if (ele.type === 1) {
        //   data[`zz${index}`] = ele.uploadUrl;
        //   data.keys.push(`zz${index}`);
        // } else {
        //   data[`url${index}`] = ele.url;
        //   data.keys.push(`url${index}`);
        // }
        data[`vodTitle${index}`] = ele.vodTitle;
        data[`price${index}`] = ele.price;
        data[`vtype${index}`] = ele.vtype;
        data[`url${index}`] = ele.url;
        data.keys.push(`price${index}`, `vodTitle${index}`, `vtype${index}`, `url${index}`);
        data.list.push(ele);
      });
      return {
        ...state,
        classForm: data,
      };
    },
    moveItem(state, { payload }) {
      const { classForm: { title, xxx, list, yyy, desc, detail } } = state;
      const { type, index } = payload;
      if (type) {
        swapArray(list, index - 1, index);
      } else {
        swapArray(list, index, index + 1);
      }
      const data = {
        title,
        xxx,
        yyy,
        desc,
        detail,
        list: [],
        keys: [],
      };
      list.forEach((ele, index) => {
        // if (ele.type !== 1) {
        //   data[`url${index}`] = ele.url;
        //   data.keys.push(`url${index}`);
        // } else {
        //   data[`zz${index}`] = ele.uploadUrl;
        //   data.keys.push(`zz${index}`);
        // }
        data[`vodTitle${index}`] = ele.vodTitle;
        data[`price${index}`] = ele.price;
        data[`vtype${index}`] = ele.vtype;
        data[`url${index}`] = ele.url;
        data.keys.push(`price${index}`, `vodTitle${index}`, `vtype${index}`, `url${index}`);
        data.list.push(ele);
      });
      return {
        ...state,
        classForm: data,
      };
    },
    setUrl(state, { payload }) {
      const { url, index } = payload;
      const { classForm } = state;
      if (classForm.keys.indexOf(`zz${index}`) === -1) {
        classForm.keys.push(`zz${index}`);
      }
      classForm[`zz${index}`] = url;
      classForm.list[index].uploadUrl = url;
      return {
        ...state,
        classForm,
      };
    },
    addClassList(state) {
      const { classForm } = state;
      classForm.list.push({});
      return {
        ...state,
        classForm,
      };
    },
    changeFormVal(state, { payload }) {
      let { classForm } = state;
      const { obj } = payload;
      const key = Object.keys(obj)[0];
      if (key.indexOf('price') === 0) {
        if (classForm.keys.indexOf(key) === -1) {
          classForm.keys.push(key);
        }
        const keys = key.replace("price","");
        classForm.list[keys].price = obj[key];
      } else if (key.indexOf('vtype') === 0) {
        if (classForm.keys.indexOf(key) === -1) {
          classForm.keys.push(key);
        }
        const keys = key.replace("vtype","");
        classForm.list[keys].vtype = obj[key];
      } else if (key.indexOf('vodTitle') === 0) {
        if (classForm.keys.indexOf(key) === -1) {
          classForm.keys.push(key);
        }
        const keys = key.replace("vodTitle","");
        classForm.list[keys].vodTitle = obj[key];
        classForm.list[keys].type = 2;
      } else if (key.indexOf('url') === 0) {
        if (classForm.keys.indexOf(key) === -1) {
          classForm.keys.push(key);
        }
        const keys = key.replace("url","");
        classForm.list[keys].url = obj[key];
      }
      classForm = {
        ...classForm,
        ...obj,
      };
      return {
        ...state,
        classForm,
      };
    },
  },
};
