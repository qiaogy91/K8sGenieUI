import instance from '@/api/client.js'


export const PROJECT_LIST = () =>{
  return instance.get('K8sGenie/rancher/?type=1')
}

export const PROJECT_QUERY = (type, keyword)=>{
  return instance.get(`K8sGenie/rancher/?type=${type}&keyword=${keyword}`)
}