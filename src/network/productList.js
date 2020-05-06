import { Request } from "@/network/request.js";


//获取商品列表
export function getProductList(params) {
  return Request({
    url: 'goods',
    params
  });
}


//删除商品列表
export function removeProductList(params) {
  return Request({
    url: 'goods/' + params,
    method: 'delete'
  });
}

//添加商品
export function sendProduct(data) {
  return Request({
    url: 'goods',
    method: 'post',
    data
  });
}