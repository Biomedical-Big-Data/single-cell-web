import request from "@/utils/request.js";

export function getFile(id) {
  return request.get(`/project/view/file/${id}`);
}

export function getUmap(file_id, group_by) {
  return request.get(`/project/view/file/umap/${file_id}`, {
    params: { group_by },
    responseType: "arraybuffer",
  });
}
