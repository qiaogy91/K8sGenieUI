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
      <div>
        <a-button type="primary" class="sync" @click="drawerOpen" :loading="data.loading">执行同步</a-button>
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

  <!-- 抽屉 -->
  <div>
    <a-drawer
      :width="800"
      :height="500"
      :visible="data.DrawerVisible"
      placement="top"
      :maskClosable="false"
      @ok="drawerClose"
      @cancel="drawerClose"
      :unmountOnClose="false"
      :hide-cancel="true"
      :ok-loading="data.loading"
      :esc-to-close="false"
    >
      <template #title> 数据同步中...</template>
      <div id="term">
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { WORKLOAD_LIST, WORKLOAD_QUERY } from '@/api/k8s.js'
import { Message } from '@arco-design/web-vue'
import { Terminal } from '@xterm/xterm'
import "@xterm/xterm/css/xterm.css";
import { getTermSize, Solarized_Darcula } from '@/views/backend/term.js'

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
    { title: '同步时间', dataIndex: 'updated_at' },
    { title: '详细信息', slotName: 'optional' }
  ],
  tableData: []
})


const drawerOpen = () => {
  data.DrawerVisible = true
  data.syncAgain = false
  data.loading = true

  setTimeout(()=>{
    let term = new Terminal({
      theme: Solarized_Darcula,
      fontSize: 13,
      convertEol: true,
      disableStdin: true,
    });

    term.open(document.getElementById('term'));
    const fitSize = () => {
      let geometry = getTermSize(term)
      term.resize(geometry.cols, geometry.rows)
    }
    // 终端大小调整
    window.onresize = fitSize()

    const socket = new WebSocket(`ws://${window.location.host}/api/v1/K8sGenie/k8s/sync`, )
    // const socket = new WebSocket(`ws://127.0.0.1:8081/api/v1/K8sGenie/k8s/sync`, )

    socket.onmessage = (data)=>{
      console.log(data.data)
      term.write(data.data)
    }
    socket.onerror = (err)=>{
      console.log('@@@@', err)
      term.write(err)
    }
    socket.onclose = ()=>{
      console.log('close')
      data.loading = false
    }
  }, 1000)



}
const drawerClose = () => {
  data.DrawerVisible = false
}

const workload_query = async () => {
  console.log(data.queryType, data.queryKeyword)
  try {
    let rsp = await WORKLOAD_QUERY(data.queryType, data.queryKeyword)
    data.tableData = []

    if (rsp.data.items && rsp.data.items.length > 0) {
      rsp.data.items.forEach((item, idx) => {
        let utime = new Date(item.meta.updated_at * 1000)
        let tp = ""
        switch (item.spec.type) {
          case 1:
            tp = "deployment"
            break
          case 2:
            tp = "cron job"
            break
          case 3:
            tp = "stateful_set"
            break
          case 4:
            tp = "daemon_set"
            break
        }

        let workload = {
          idx: idx,
          type: tp,
          name: item.spec.name,
          namespace: item.spec.namespace,
          replicas: item.spec.replicas,
          cpu: item.spec.cpu,
          ram: item.spec.ram,
          project_id: item.spec.project_id,
          updated_at: utime.toLocaleString()
        }
        data.tableData.push(workload)
      })
    }
  } catch (err) {
    console.log(err)
    Message.error(err.statusText)
  }
}

const workload_list = async () => {
  try {
    let rsp = await WORKLOAD_LIST()
    data.tableData = []
    if (rsp.data.items && rsp.data.items.length > 0) {
      rsp.data.items.forEach((item, idx) => {
        let utime = new Date(item.meta.updated_at * 1000)
        let tp = ""
        switch (item.spec.type) {
          case 1:
            tp = "deployment"
            break
          case 2:
            tp = "cron job"
            break
          case 3:
            tp = "stateful_set"
            break
          case 4:
            tp = "daemon_set"
            break
        }

        let workload = {
          idx: idx,
          type: tp,
          name: item.spec.name,
          namespace: item.spec.namespace,
          replicas: item.spec.replicas,
          cpu: item.spec.cpu,
          ram: item.spec.ram,
          project_id: item.spec.project_id,
          updated_at: utime.toLocaleString()
        }
        data.tableData.push(workload)
      })
    }
  } catch (err) {
    console.log(err)
    Message.error(err.statusText)
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
