import { Request } from "@/network/request.js";


//获取商品分类信息
export function getCateListInfo() {
  return Request({
    url: 'categories'
  });
}

//获取商品参数列表信息
export function getCateParams(id, sel) {
  return Request({
    url: `categories/${id}/attributes`,
    params: {
      sel
    }
  });
}

//添加动态参数/静态属性
export function addParamsData(id, data) {
  return Request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data
  });
}

//删除指定参数/属性
export function deleteParamsInfo(cat_id, attr_id) {
  return Request({
    url: 'categories/' + cat_id + '/attributes/' + attr_id,
    method: 'delete'
  });
}

//修改指定参数/属性
export function editParamsInfo(id, attr_id, data) {
  return Request({
    url: 'categories/' + id + '/attributes/' + attr_id,
    method: 'put',
    data
  });
}