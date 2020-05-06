import { Request } from "@/network/request.js";

// 获取订单列表信息
export function getOrderData(params) {
  return Request({
    url: 'orders',
    params
  });
}

// 获取物流信息
export function getlogisticsData() {
  return Request({
    url: '/kuaidi/804909574412544580'
  });
}