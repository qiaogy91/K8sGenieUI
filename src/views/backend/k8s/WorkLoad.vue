<template>
  <div class="header">
    <a-space>
      <div>
        <a-select
          :style="{ width: '150px' }"
          v-model="data.queryType"
          placeholder="select ..."
          allow-clear
        >
          <a-option value="1">查询所有</a-option>
          <a-option value="4">项目编码</a-option>
          <a-option value="2">名称空间</a-option>
          <a-option value="3">负载名称</a-option>
        </a-select>
      </div>

      <div>
        <a-input-search
          :style="{ width: '320px' }"
          placeholder="Please enter"
          search-button
          v-model:="data.queryKeyword"
          @search="workload_query"
          @press-enter="workload_query"
        >
          <template #button-icon>
            <icon-search />
          </template>
          <template #button-default> Search</template>
        </a-input-search>
      </div>
    </a-space>
  </div>
  <div class="content">
    <a-table :columns="data.tableColumns" :data="data.tableData">
      <template #optional="{ record }">
        <a-button @click="$modal.info({ title: 'Name', content: record.project_id })"
          >View
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { WORKLOAD_LIST, WORKLOAD_QUERY } from '@/api/k8s.js'
import { Message } from '@arco-design/web-vue'

const data = reactive({
  // query 参数
  queryType: undefined,
  queryKeyword: '',

  // table 数据
  tableColumns: [
    { title: '序号', dataIndex: 'idx' },
    { title: '类型', dataIndex: 'type' },
    { title: '名称空间', dataIndex: 'namespace' },
    { title: '负载名称', dataIndex: 'name' },
    { title: '副本数量', dataIndex: 'replicas' },
    { title: 'CPU 核数', dataIndex: 'cpu' },
    { title: 'RAM 大小', dataIndex: 'ram' },
    { title: '详细信息', slotName: 'optional' }
  ],
  tableData: []
})

const workload_query = async () => {

  try {
    let rsp = await WORKLOAD_QUERY(data.queryType, data.queryKeyword)
    data.tableData = []

    console.log(rsp)
    if (rsp.data.items && rsp.data.items.length > 0) {
      rsp.data.items.forEach((item, idx) => {
        let workload = {
          idx: idx,
          type: item.spec.type,
          name: item.spec.name,
          namespace: item.spec.namespace,
          replicas: item.spec.replicas,
          cpu: item.spec.cpu,
          ram: item.spec.ram,
          project_id: item.spec.project_id
        }
        data.tableData.push(workload)
      })
    }
  } catch (err) {
    console.log(err)
    Message.error(err)
  }
}

const workload_list = async () => {
  try {
    let rsp = await WORKLOAD_LIST()
    data.tableData = []
    rsp.data.items.forEach((item, idx) => {
      let workload = {
        idx: idx,
        type: item.spec.type,
        name: item.spec.name,
        namespace: item.spec.namespace,
        replicas: item.spec.replicas,
        cpu: item.spec.cpu,
        ram: item.spec.ram,
        project_id: item.spec.project_id
      }
      data.tableData.push(workload)
    })
  } catch (err) {
    console.log(err)
    Message.error(err)
  }
}

onMounted(() => {
  workload_list()
})
</script>

<style scoped>
.header {
  padding: 10px;
}

.content {
  padding: 10px;
}
</style>
