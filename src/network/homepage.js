import { Request } from "@/network/request.js";


//添加用户请求
export function addRequest(data) {
  return Request({
    url: 'users',
    method: 'post',
    data
  });
}

//修改用户信息请求  -- 请求原来的用户信息
export function editRequest(id) {
  return Request({
    url: 'users/' + id
  });
}

//修改用户信息操作
export function editUserInfo(payload) {
  return Request({
    url: 'users/' + payload.id,
    method: 'put',
    data: payload.data
  });
}

//删除用户信息操作
export function removeUserInfo(id) {
  return Request({
    url: 'users/' + id,
    method: 'delete'
  });
}

