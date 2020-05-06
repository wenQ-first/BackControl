import { Request } from "@/network/request.js";


//删除用户信息操作
export function getPowerListInfo() {
  return Request({
    url: 'rights/list'
  });
}

//获取所有角色列表
export function getRoleListInfo() {
  return Request({
    url: 'roles'
  });
}

//删除指定角色列表 
export function deleteRoleListInfo(id) {
  return Request({
    url: 'roles/' + id,
    method: 'delete'
  });
}


//修改指定角色列表 --点击获取当前数据
export function editRoleInfo(id) {
  return Request({
    url: 'roles/' + id
  });
}

//修改角色信息操作
export function editRolesData(payload) {
  return Request({
    url: 'roles/' + payload.id,
    method: 'put',
    data: payload.data
  });
}

//添加角色请求
export function addRoleList(data) {
  return Request({
    url: 'roles',
    method: 'post',
    data
  });
}

//删除角色指定权限
export function removeRoleTag(data) {
  return Request({
    url: `roles/${data.id}/rights/${data.tagId}`,
    method: 'delete'
  });
}

//获取分配权限的树形结构数据
export function getTreeRoleData() {
  return Request({
    url: `rights/tree`,
    method: 'get'
  });
}


//分配权限成功，点击确定按钮发送请求
export function sendTreeRoleData(id, rids) {
  return Request({
    url: `roles/${id}/rights`,
    method: 'post',
    data: {
      rids
    },
  });
}


