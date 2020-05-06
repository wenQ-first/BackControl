import { Request } from "@/network/request.js";


//获取商品分类信息
export function getCateListInfo(params) {
  return Request({
    url: 'categories',
    params: {
      params
    }
  });
}

//获取父级分类列表信息
export function getParentCateInfo() {
  return Request({
    url: 'categories',
    params: {
      type: 2
    }
  });
}

//添加--分类请求
export function sendAddCate(data) {
  return Request({
    url: 'categories',
    method: 'post',
    data
  });
}

//删除--分类请求
export function deleteAddCate(id) {
  return Request({
    url: 'categories/' + id,
    method: 'delete'
  });
}