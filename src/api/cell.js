import request from "@/utils/request.js";

export function getCellTaxonomy(cell_marker) {
  return request.get("/project/view/tree/cell_taxonomy", {
    params: {
      cell_marker,
    },
  });
}
