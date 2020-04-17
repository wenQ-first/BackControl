import { Request } from "@/network/request.js";


//获取用户列表数据
export default function userRequest(params) {
  return Request({
    url: 'users',
    params
  });
}

