import instance from '@/api/client.js'

export const USER_LOGIN = (data)=>{
  return instance.post('UserCenter/token', data)
}


export const USER_LIST = () =>{
  return instance.get('UserCenter/user/?type=1')
}

export const USER_CREATE = (data)=>{
  return instance.post('UserCenter/user', data)
}