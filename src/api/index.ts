import request from '../service'

export const login = (data: object) => {
  return request.post('/users/login', data)
}

export const getUserInfo = () => {
  return request.get('/users/infos')
}
