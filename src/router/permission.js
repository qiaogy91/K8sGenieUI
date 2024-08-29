import 'nprogress/nprogress.css'
import NProgress from "nprogress";
import {useLocalStore} from "@/stores/localStorage.js";


// 进度条配置
NProgress.configure({
  showSpinner: false  // 关闭旋转加载器
})


// 未登录的用户、并且页面元数据要求登录，则跳到登录页面
export const beforeEachHandler = (to, from, next) =>{
  // 进度条开始加载
  NProgress.start()

  // 页面需要登录后才能访问、并且此时用户是未登录状态
  const store = useLocalStore()

  if (to.meta.auth && !store.isLogin) {
    next({name: "login", query: {to: to.name}})
    return
  }
  next() // 交给后续路由处理
}


// 更改页面Title
export const afterEchHandler = (to)=>{
  document.title = to.meta.title
  NProgress.done();  // 进度条加载完毕
}