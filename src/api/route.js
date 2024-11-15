import instance from '@/api/client.js'




export const ROUTE_QUERY = (type, keyword) =>{
  return instance.get(`K8sGenie/router?type=${type}&keyword=${keyword}`)
}
export const ROUTE_CREATE = (data)=>{
  return instance.post('K8sGenie/router/', data)
}

export const ROUTE_DELETE = (id) =>{
  return instance.delete(`K8sGenie/router/${id}`)
}