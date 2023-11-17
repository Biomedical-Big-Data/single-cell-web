export const GENE_COLUMNS = [
  {
    title: "Gene Symbol",
    dataIndex: "gene_symbol",
    group: "gene_expression",
    autoHidden: false,
  },
  {
    title: "Gene EnsembleID",
    dataIndex: "gene_EnsembleID",
    group: "gene_expression",
  },
  // {
  //   title: "Cell Proportion Expression The Gene",
  //   dataIndex: "cell_proportion_expression_the_gene",
  //   group: "gene",
  // },
  // {
  //   title: "Average Gene Expression",
  //   dataIndex: "average_gene_expression",
  //   group: "gene",
  // },
  {
    title: "Suggested Surfaceome Protein For Facs Sorting",
    dataIndex: "suggested surfaceome protein for FACS sorting",
    group: "gene_expression",
  },
].map((item) => ({
  autoHidden: true,
  ...item,
  dataIndex: ["gene_expression_meta", item.dataIndex],
}))
