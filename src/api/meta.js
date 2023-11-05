import request from "@/utils/request.js"

export function getSpecialList(params) {
  return request.get("/admin/species/list", { params })
}

export function getGeneList(params) {
  return request.get("/admin/gene/list", { params })
}

export function getCellTypeList(params) {
  return request.get("/admin/cell/list", { params })
}

export function updateMetaByFile(file_type, file) {
  const formData = new FormData()
  formData.append("meta_file", file)
  formData.append("file_type", file_type)
  return request.post("/admin/project/meta/file/upload", formData)
}
