import request from "@/utils/request.js"

export function getCellTaxonomy(cell_standard = "") {
  return request.get("/project/view/tree/cell_taxonomy", {
    params: {
      cell_standard,
    },
  })
}

export function getGeneCellTaxonomy({
  species_id,
  genes_positive,
  genes_negative,
  asc,
}) {
  return request.get("/project/view/table/cell_taxonomy", {
    params: {
      species_id,
      genes_positive,
      genes_negative,
      asc,
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
