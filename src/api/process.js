import request from "@/utils/request.js"

export function getProcessList() {
  return request.get("/admin/project/process/cache_status")
}

export function getSeverList() {
  return request.get("/admin/server/status")
}

export function terminateProcess(h5ad_id) {
  return request.get(`/admin/project/process/${h5ad_id}/terminate`)
}
