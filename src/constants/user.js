export const USER_STATUS = {
  ENABLE: 1,
  INACTIVATED: 0,
  DISABLE: -1,
}
export const USER_STATUS_DESC = [
  {
    label: 'Enable',
    value: USER_STATUS.ENABLE,
  },
  {
    label: 'Inactivated',
    value: USER_STATUS.INACTIVATED,
  },
  {
    label: 'Disable',
    value: USER_STATUS.DISABLE
  },
]

export const USER_ROLE = {
  NORMAL: 0,
  ADMIN: 1,
  SUPER: 2
}

export const USER_ROLE_DESC = [
  {
    label: 'Normal',
    value: USER_ROLE.NORMAL,
  },
  {
    label: 'Admin',
    value: USER_ROLE.ADMIN,
  },
  {
    label: 'Super',
    value: USER_ROLE.SUPER,
  },
]
