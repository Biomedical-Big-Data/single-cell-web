import request from "@/utils/request.js"

export function getCellTaxonomy({ cell_standard, cell_type_id } = {}) {
  return request.get("/project/view/tree/cell_taxonomy", {
    params: {
      cell_standard,
      cell_type_id,
    },
  })
}

export function getGeneCellTaxonomy({
  species_id,
  genes_positive,
  genes_negative,
  asc,
  page,
  page_size,
}) {
  return request.get("/project/view/table/cell_taxonomy", {
    params: {
      species_id,
      genes_positive,
      genes_negative,
      asc,
      page,
      page_size,
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
