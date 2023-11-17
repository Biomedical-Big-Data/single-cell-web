export const PROJECT_STATUS = {
  DRAFT: 0,
  AVAILABLE: 1,
}

export const AUDIT_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: -1,
}

export const PROJECT_STATUS_DESC = [
  {
    value: PROJECT_STATUS.DRAFT,
    label: "Draft",
  },
  {
    value: PROJECT_STATUS.AVAILABLE,
    label: "Published",
  },
]

export const IS_PRIVATE_DESC = [
  {
    label: "Private",
    value: 1,
  },
  {
    label: "Public",
    value: 0,
  },
]

export const AUDIT_STATUS_DESC = [
  {
    value: AUDIT_STATUS.PENDING,
    label: "待审核",
  },
  {
    value: AUDIT_STATUS.APPROVED,
    label: "审核通过",
  },
  {
    value: AUDIT_STATUS.REJECTED,
    label: "审核不通过",
  },
]
