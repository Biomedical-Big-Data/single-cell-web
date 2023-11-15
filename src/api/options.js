import request from "@/utils/request.js"

export function getGeneSymbolList({ gene_symbol, page = 1, page_size = 20 }) {
  return request.get("/project/gene_symbol/list", {
    params: {
      gene_symbol,
      page,
      page_size,
    },
  })
}

export function getCellTypeList({ cell_type_id, page = 1, page_size = 20 }) {
  return request.get("/project/cell_type/list", {
    params: {
      cell_type_id,
      page,
      page_size,
    },
  })
}

export function getSpecieList({ page = 1, page_size = 20 } = {}) {
  return request.get("/project/species/list", {
    params: {
      page,
      page_size,
    },
  })
}
