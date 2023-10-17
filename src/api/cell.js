import request from "@/utils/request.js"

export function getCellTaxonomy(cell_marker) {
  return request.get("/project/view/tree/cell_taxonomy", {
    params: {
      cell_marker,
    },
  })
}

export function getTaxonomyDetail(cl_id) {
  return request.get("/project/taxonomy/info", {
    params: {
      cl_id,
    },
  })
}
