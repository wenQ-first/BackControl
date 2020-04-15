import { Request } from "@/network/request.js";

export function loginRequest(data) {
  return Request({
    url: 'login',
    method: 'post',
    data
  });
}