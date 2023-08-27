export const SPECIES = [
  {
    value: 1,
    label: '人类'
  },
  {
    value: 2,
    label: '老鼠'
  }
]

export const PROJECT_STATUS = {
  OFFLINE: -1,
  DRAFT: 0,
  NEED_AUDIT: 1,
  AVAILABLE: 2
}

export const PROJECT_STATUS_DESC = [
  {
    value: PROJECT_STATUS.OFFLINE,
    label: '下线'
  },
  {
    value: PROJECT_STATUS.DRAFT,
    label: '草稿'
  },
  {
    value: PROJECT_STATUS.NEED_AUDIT,
    label: '审核中'
  },
  {
    value: PROJECT_STATUS.AVAILABLE,
    label: '已发布'
  }
]

export const IS_PRIVATE_DESC = [
  {
    label: '私有',
    value: 1
  },
  {
    label: '公开',
    value: 0
  }
]
