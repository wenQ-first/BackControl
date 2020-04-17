import { Request } from "@/network/request.js";


//更改siwtch状态
export function stateRequest(id, state) {
  return Request({
    url: 'users/' + id + '/state/' + state,
    method: 'put'
  });
}
