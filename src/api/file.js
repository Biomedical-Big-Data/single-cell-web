import request from '@/utils/request.js'

export function getFile(id) {
  return request.get(`/project/view/file/${id}`)
}
