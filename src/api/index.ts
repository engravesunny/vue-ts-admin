import request from '../service'

export const login = (data: object) => {
  return request.post('/users/login', data)
}

export const getUserInfo = () => {
  return request.get('/users/infos')
}

export const getSignInfo = (params: object) => {
  return request.get('/signs/time', params)
}

export const setTime = (data: object) => {
  return request.put('/signs/time', data)
}

export const getChecks = (params: object) => {
  return request.get('/checks/apply', params)
}

export const postApply = (data: object) => {
  return request.post('/checks/apply', data)
}

export const putApply = (data: object) => {
  return request.put('/checks/apply', data)
}

export const getNews = (params: object) => {
  return request.get('/news/remind', params)
}

export const putNews = (data: object) => {
  return request.put('/news/remind', data)
}
