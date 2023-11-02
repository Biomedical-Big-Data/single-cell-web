import request from "@/utils/request.js"

export function getFile(id) {
  return request.get(`/project/view/file/${id}`)
}

export function getCellMarkerFile(id) {
  return request.get(`/project/view/file/cell_marker/${id}`)
}
export function getCellPathwayFile(id) {
  return request.get(`/project/view/file/pathway_score/${id}`)
}

export function getUmap(file_id, group_by) {
  return request.get(`/project/view/file/umap/${file_id}`, {
    params: { group_by },
    responseType: "arraybuffer",
  })
}

export function getDownloadFileToken(id) {
  return request.get(`/project/download/file/${id}/token`)
}
