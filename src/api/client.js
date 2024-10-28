import axios from "axios";
import { useLocalStore } from '@/stores/localStorage.js'

export const instance = axios.create({
  baseURL: "/api/v1",
  timeout: 5000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config)=>{
    const store = useLocalStore()
    if (store.accessToken){
      config.headers.Authorization = store.accessToken
    }
    return config
  },
  (err)=>{
    return Promise.reject(err)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  (rsp) => {
    return rsp.data
  },
  (err) => {
    switch (err.response.status) {
      case 401:
        // 未授权，则先跳到登录页
        return window.location.href = "/login"
      case 403:
        // 没权限，直接返回无权限访问
        return Promise.reject("无权限访问")
      default:
        // 其他情况优先使用后端API返回的错误消息；没有的话则用 axios 返回的消息
        if (err.response.data) {
          return Promise.reject(err.response)
        }
        return Promise.reject(err.message)
    }
  }
)
export default instance