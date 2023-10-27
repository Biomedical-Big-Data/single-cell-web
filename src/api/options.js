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

export function getSpecieList({ page = 1, page_size = 20 } = {}) {
  return request.get("/project/species/list", {
    params: {
      page,
      page_size,
    },
  })
}
