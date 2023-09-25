import request from '@/utils/request'

export function getOrganList(keywords) {
  return request.get('/project/organ/list', {
    params: { organ: keywords }
  })
}

export function getSampleProjectList(params) {
  return request.get('/project/list/by/sample', {
    params
  })
}

export function getCellProjectList(params) {
  return request.get('/project/list/by/cell', {
    params
  })
}

export function getGeneProjectList(params) {
  return request.get('/project/list/by/gene', {
    params
  })
}

export function getProjectDetail(id) {
  return request.get(`/project/${id}`)
}

export function getAdminProjectDetail(id) {
  return request.get(`/admin/project/${id}`)
}

export function getAdminProjectList(params) {
  return request.get('/admin/project/list', { params })
}

export function getMyProjectFile(params) {
  return request.get('/project/file/me', { params })
}

export function uploadProjectFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/project/file/upload', formData)
}

export function getMyProjectList(params) {
  return request.get('/project/me', { params })
}

export function createProject(data) {
  return request.post('/project/create', data)
}

export function updateProject(data) {
  return request.post('/project/update', data)
}
export function updateAdminProject(data) {
  return request.post(`/admin/project/${data.project_id}/update`, data)
}

export function offlineProject(id) {
  return request.post(`/project/${id}/offline`)
}

export function transferProject(id, mail) {
  return request.post(`/project/${id}/transfer`, { transfer_to_email_address: mail })
}

export function getProjectGeneChartData({ gene_symbol, species_id }) {
  return request.get(`/project/list/by/gene/graph`, {
    params: { gene_symbol, species_id }
  })
}

export function getCellNumber(analysis_id){
  return request.get(`/project/${analysis_id}/graph/cell_number`)
}
