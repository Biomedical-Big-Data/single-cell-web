export function joinTableIndex (dataIndex) {
  if (Array.isArray(dataIndex)) {
    return dataIndex.join('.')
  } else {
    return dataIndex
  }
}
