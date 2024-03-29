import request from "@/utils/request"

export function getOrganList(keywords) {
  return request.get("/project/organ/list", {
    params: { organ: keywords },
  })
}

export function getSampleProjectList(params) {
  return request.get("/project/list/by/sample", {
    params,
  })
}

export function downloadSampleProjectList(params) {
  return request.get("/project/list/by/sample/download", {
    params,
    responseType: "blob",
  })
}

export function getCellProjectList(params) {
  return request.get("/project/list/by/cell", {
    params,
  })
}

export function downloadCellProjectList(params) {
  return request.get("/project/list/by/cell/download", {
    params,
    responseType: "blob",
  })
}

export function getGeneProjectList(params) {
  return request.get("/project/list/by/gene", {
    params,
  })
}

export function downloadGeneProjectList(params) {
  return request.get("/project/list/by/gene/download", {
    params,
    responseType: "blob",
  })
}

export function getProjectDetail(id) {
  return request.get(`/project/${id}`)
}

export function getAdminProjectDetail(id) {
  return request.get(`/admin/project/${id}`)
}

export function adminProjectTransfer(id, mail) {
  return request.post(`/admin/project/${id}/transfer`, {
    transfer_to_email_address: mail,
  })
}

export function getAdminProjectList(params) {
  return request.get("/admin/project/list", { params })
}

export function getMyProjectFile(params) {
  return request.get("/project/file/me", { params })
}

export function removeProject(id) {
  return request.delete(`/project/${id}`)
}

export function removeMyProjectFile(id) {
  return request.delete(`/project/file/${id}`)
}

export function uploadProjectFile(file, config) {
  const formData = new FormData()
  formData.append("file", file)
  return request.post("/project/file/upload", formData, config)
}

export function getMyProjectList(params) {
  return request.get("/project/me", { params })
}

export function createProject(data) {
  return request.post("/project/create", data)
}

export function updateProject(data) {
  return request.post("/project/update", data)
}

export function updateAdminProject(data) {
  return request.post(`/admin/project/${data.project_id}/update`, data)
}

export function offlineProject(id) {
  return request.post(`/project/${id}/offline`)
}
export function adminOfflineProject(id) {
  return request.post(`/admin/project/${id}/offline`)
}

export function approveProject(id) {
  return request.post(`/admin/project/${id}/status/update`, {
    is_audit: 1,
  })
}

export function transferProject(id, mail) {
  return request.post(`/project/${id}/transfer`, {
    transfer_to_email_address: mail,
  })
}

export function copyProject(id, mail) {
  return request.post(`/project/${id}/copy`, {
    copy_to_email_address: mail,
  })
}

export function getProjectGeneChartData({ gene_symbol, species_id }) {
  return request.get(`/project/list/by/gene/graph`, {
    params: { gene_symbol, species_id },
  })
}

export function getCellNumber(analysis_id) {
  return request.get(`/project/${analysis_id}/graph/cell_number`)
}

export function getPathwayData(analysis_id) {
  return request.get(`/project/${analysis_id}/graph/pathway`)
}

export function searchItemsByType(keywords, type) {
  return request.get("/project/sample/list", {
    params: {
      [type]: keywords,
    },
  })
}
