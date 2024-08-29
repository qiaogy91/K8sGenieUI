import instance from '@/api/client.js'


export const WORKLOAD_LIST = () =>{
  return instance.get('K8sGenie/k8s/workload?type=1')
}


export const WORKLOAD_QUERY = (type, keyword) =>{
  return instance.get(`K8sGenie/k8s/workload?type=${type}&keyword=${keyword}`)
}

