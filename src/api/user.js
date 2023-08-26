import request from '@/utils/request'

export function login({ email_address, user_password }) {
  const form = new FormData()
  form.append('username', email_address)
  form.append('password', user_password)
  return request.post('/user/login', form)
}

export function register({ user_name, user_password, organization, email_address }) {
  return request.post('/user/register', {
    user_name,
    user_password,
    organization,
    email_address
  })
}

export function getUserInfo() {
  return request.get('/user/me')
}

export function updateMyUserInfo({ organization, password }) {
  return request.post('/user/me/edit', {
    organization,
    password
  })
}

export function sendResetPasswordMail(email_address) {
  return request.post('/user/password/reset/mail/send', {
    email_address
  })
}

export function activeUser(token) {
  return request.get('/user/email/verify', {
    params: {
      token
    }
  })
}

export function resetPassword({ token, password }) {
  return request.post('/user/password/reset', {
    token,
    password
  })
}

export function getUserList({
  page,
  page_size,
  user_name,
  email_address,
  organization,
  state,
  create_at
}) {
  return request.get('/admin/user/list', {
    params: {
      page,
      page_size,
      user_name,
      email_address,
      organization,
      state,
      create_at
    }
  })
}

export function updateUserState(user_id, state) {
  return request.post(`/admin/user/${user_id}/edit`, { state })
}

export function updateUserPassword(user_id, user_password) {
  return request.post(`/admin/user/${user_id}/edit`, { user_password })
}
