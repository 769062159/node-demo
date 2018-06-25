import { stringify } from 'qs';
import request from '../utils/request';
import * as menuConfig from './../common/menu';

import { menuData } from './../../mock/menuData';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/admin/myinfo', { method: 'POST' });
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

// 登陆
export async function fakeAccountLogin(params) {
  return request('/admin/login', {
    method: 'POST',
    body: params,
  });
}
// 退出
export async function fakeAccountLogout() {
  return request('/admin/logout', {
    method: 'POST',
  });
}

// 获取所有的菜单
export async function getAllMenu() {
  return request('/admin/menu/list', {
    method: 'POST',
  });
}

// 创建菜单
export async function addMenu(params) {
  return request('/admin/menu/create', {
    method: 'POST',
    body: params,
  });
}
// 删除菜单
export async function deleteMenu(params) {
  return request('/admin/menu/delete', {
    method: 'POST',
    body: params,
  });
}
// 角色列表
export async function getRoleList(params) {
  return request('/admin/gr/role/list', {
    method: 'POST',
    body: params,
  });
}
// 设置角色菜单
export async function setRoleMenu(params) {
  return request('/admin/menu/setmenu', {
    method: 'POST',
    body: params,
  });
}
// 获取角色菜单
export async function getRoleMenu(params) {
  return request('/admin/menu/rolelist', {
    method: 'POST',
    body: params,
  });
}
// 部门列表
export async function getGroupList(params) {
  return request('/admin/gr/group/list', {
    method: 'POST',
    body: params,
  });
}
// 用户列表
export async function getUserList(params) {
  return request('/admin/user/list', {
    method: 'POST',
    body: params,
  });
}
// 删除用户
export async function deleteUser(params) {
  return request('/admin/user/status', {
    method: 'POST',
    body: params,
  });
}
// 用户[创建部门/角色]
export async function addDep(params) {
  return request('/admin/gr/create', {
    method: 'POST',
    body: params,
  });
}
// 用户[删除部门/角色]
export async function delDep(params) {
  return request('/admin/gr/delete', {
    method: 'POST',
    body: params,
  });
}
// 用户创建
export async function addUser(params) {
  return request('/admin/user/create', {
    method: 'POST',
    body: params,
  });
}
// 所有商品
export async function getAllGoods(params) {
  return request('/admin/goods/list', {
    method: 'POST',
    body: params,
  });
}
// 上传图片
export async function uploadImg(params) {
  return request('/admin/upload', {
    method: 'POST',
    body: params,
  });
}
export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

// 所有菜单列表
export async function getAuthMenus() {
  return new Promise(resolve => {
    resolve(menuConfig.getMenuData(menuData));
  });
}
// 我的菜单列表
// export async function getAuthMenus() {
// 	return request('/admin/menu/list', { method: 'POST'}).then((datas) => {
//     const menu = datas.data;
//     menu.forEach(element => {
//       element.name = element.menu_name;
//       element.children.forEach(res => {
//         res.name = res.menu_name;
//       });
//     });
// 		return new Promise( (resolve) => {
// 			resolve(menu);
// 		});
// 	});
// }
// export async function getAuthMenus() {
// 	return request('/admin/menu/list', {
//     method: 'POST',
//   });
// }

export async function getRouterData(routerConfig, menuData) {
  const flatMenuData = menuConfig.getFlatMenuData(menuData);
  return menuConfig.getRouterData(routerConfig, flatMenuData);
}

export function getRouterDataSync(routerConfig, menuData) {
  const flatMenuData = menuConfig.getFlatMenuData(menuData);
  return menuConfig.getRouterData(routerConfig, flatMenuData);
}
