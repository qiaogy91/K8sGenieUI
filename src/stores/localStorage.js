import { defineStore } from 'pinia'

export const useLocalStore = defineStore('Genie', {
  // 用户的登录状态、格式偏好设置等信息，都没有必要存储在后端DB，更加适合存储到浏览器本地
  state: () => ({
    isLogin: false,
    userName: '',
    accessToken: '',
    refreshToken: '',
  }),
  persist: true // 持久化到localStorage
})
