import { Request } from "@/network/request.js";

export function getReportData() {
  return Request({
    url: 'reports/type/1'
  });
}