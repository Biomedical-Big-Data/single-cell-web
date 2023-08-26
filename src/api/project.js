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

export function getAdminProjectList(params) {
  return request.get('/admin/project/list', { params })
}
