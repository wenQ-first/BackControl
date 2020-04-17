import { Request } from "@/network/request.js";

export default function homeRequest() {
  return Request({
    url: 'menus'
  });
}