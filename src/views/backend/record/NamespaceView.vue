<template>
  <div style="margin: 10px">
    <a-row :size="24">
      <a-col :span="23">
        <a-space direction="vertical">
          <a-input-group>
            <a-select
              :style="{ width: '200px' }"
              placeholder="选择集群"
              v-model="data.search.clusterName"
            >
              <a-option value="crc-itcp-test-03">crc-itcp-test-03</a-option>
              <a-option value="crc-itcp-prd-02">crc-itcp-prd-02</a-option>
              <a-option value="itcp-k8s-uat">itcp-k8s-uat</a-option>
              <a-option value="itcp-k8s-prd">itcp-k8s-prd</a-option>
              <a-option value="itcp-k8s-xc-uat">itcp-k8s-xc-uat</a-option>
              <a-option value="itcp-k8s-xc-uat">itcp-k8s-xc-prd</a-option>
            </a-select>
            <a-input
              :style="{ width: '200px' }"
              placeholder="产线名称"
              allow-clear
              v-model="data.search.projectLine"
            />
            <a-input
              :style="{ width: '200px' }"
              placeholder="项目编码"
              allow-clear
              v-model="data.search.projectCode"
            />
            <a-date-picker style="width: 200px" v-model="data.search.createdTime" />
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              <template #default>Search</template>
            </a-button>
          </a-input-group>
        </a-space>
      </a-col>
      <a-col :span="1">
        <json-excel
          :data="data.tableData"
          name="data.xlsx"
        >
          <a-button type="primary"><template #icon><icon-download /></template></a-button>
        </json-excel>
      </a-col>
    </a-row>



  </div>

  <div style="margin: 10px">
    <a-table :columns="data.tableColumns" :data="data.tableData" />
  </div>
</template>
<script setup>
import { DatePicker } from '@arco-design/web-vue'

import { IconSearch } from '@arco-design/web-vue/es/icon/index.js'
import { reactive, ref } from 'vue'
import { NAMESPACE_RECORD } from '@/api/record.js'



const data = reactive({

  search: {
    createdTime: '',
    clusterName: '',
    projectLine: '',
    projectCode: ''
  },
  tableColumns: [
    { title: '序号', dataIndex: 'idx' },
    { title: '统计时间', dataIndex: 'createdAt' },
    { title: '集群名称', dataIndex: 'cluster' },
    { title: '产线名称', dataIndex: 'line' },
    { title: '项目名称', dataIndex: 'project_desc' },
    { title: '项目编码', dataIndex: 'project_code' },
    { title: '名称空间', dataIndex: 'namespace' },
    { title: '用量权重', dataIndex: 'weight' },
    { title: '用量占比', dataIndex: 'percent' },
  ],
  tableData: []
})

const search = async () => {
  let res = await NAMESPACE_RECORD(data.search.createdTime, data.search.clusterName, data.search.projectLine, data.search.projectCode)
  console.log(res.data)

  data.tableData = []
  res.data.forEach((item, idx) => {
    let t = new Date(item.createdAt * 1000)
    let dic = {
      idx: idx +1,
      createdAt: t.toLocaleString(),
      cluster: item.cluster_name,
      line: item.project_line,
      project_desc: item.project_desc,
      project_code: item.project_code,
      namespace: item.namespace_wight.namespace,
      weight: item.namespace_wight.weight,
      percent: item.namespace_wight.percent,
    }
    data.tableData.push(dic)
  })
}
</script>

<style scoped></style>
