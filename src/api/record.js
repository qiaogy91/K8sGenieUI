import instance from '@/api/client.js'


export const CLUSTER_RECORD = (month, clusterName) =>{
  return instance.get(`K8sGenie/record/cluster?month=${month}&clusterName=${clusterName}`)
}



export const PROJECT_RECORD = (month, clusterName, projectLine) =>{
  return instance.get(`K8sGenie/record/project?month=${month}&clusterName=${clusterName}&projectLine=${projectLine}`)
}


export const NAMESPACE_RECORD = (createdTime, clusterName, projectLine, projectCode) =>{
  console.log(`K8sGenie/record/namespace?createdAt=${createdTime}&clusterName=${clusterName}&projectLine=${projectLine}&projectCode=${projectCode}`)
  return instance.get(`K8sGenie/record/namespace?createdAt=${createdTime}&clusterName=${clusterName}&projectLine=${projectLine}&projectCode=${projectCode}`)
}
