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
          <a-option value="2">集群编码</a-option>
          <a-option value="3">项目产线</a-option>
          <a-option value="4">项目编码</a-option>
          <a-option value="5">项目描述</a-option>
        </a-select>
      </div>

      <div>
        <a-input-search
          :style="{ width: '320px' }"
          placeholder="Please enter"
          search-button
          v-model:="data.queryKeyword"
          @search="project_query"
          @press-enter="project_query"
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
        <a-button @click="userView(record)" type="outline">查看</a-button>
      </template>
    </a-table>
  </div>

  <div>
    <a-modal v-model:visible="data.userVisible" @ok="handleOk" @cancel="handleOk">
      <template #title> Title</template>
      项目：{{data.recordCurrent.project_id}}<br>
      用户：{{data.recordCurrent.users}}
    </a-modal>
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
import { PROJECT_LIST, PROJECT_QUERY } from '@/api/rancher.js'
import { onMounted, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import {Terminal, } from '@xterm/xterm'
import "@xterm/xterm/css/xterm.css";

import {getTermSize, Solarized_Darcula} from '@/views/backend/term.js'


const data = reactive({
  tableColumns: [
    { title: '序号', dataIndex: 'idx' },
    { title: '集群编码', dataIndex: 'cluster_name' },
    { title: '项目编码', dataIndex: 'project_code' },
    { title: '项目描述', dataIndex: 'project_desc' },
    { title: '所属产线', dataIndex: 'project_line' },
    { title: '最后更新时间', dataIndex: 'updated_at' },
    { title: '联系人', slotName: 'optional' }
  ],
  tableData: [],
  queryType: undefined,
  queryKeyword: '',

  // 模态框：查看用户信息
  userVisible: false,
  recordCurrent: {},

  // 抽屉：同步项目资源
  DrawerVisible: false,
  loading: false,
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

    // const socket = new WebSocket(`ws://${window.location.host}/api/v1/K8sGenie/rancher/sync`);
    const socket = new WebSocket("ws://127.0.0.1:8081/api/v1/K8sGenie/rancher/sync", )

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

// 条件查询
const project_query = async () => {
  console.log('project_query', data.queryType, data.queryKeyword)
  try {
    let rsp = await PROJECT_QUERY(data.queryType, data.queryKeyword)

    console.log(rsp)
    if (rsp.data.items && rsp.data.items.length > 0) {
      data.tableData = []
      rsp.data.items.forEach((item, idx) => {
        let utime = new Date(item.meta.updated_at * 1000)
        let project = {
          key: idx,
          idx: idx,
          project_id: item.spec.project_id,
          updated_at: utime.toLocaleString(),
          cluster_name: item.spec.cluster_name,
          project_code: item.spec.project_code,
          project_desc: item.spec.project_desc,
          project_line: item.spec.project_line,
          users: item.spec.users
        }
        data.tableData.push(project)
      })
    }
  } catch (err) {
    console.log(err)
    Message.error
  }
}

// 项目中用户信息模态框
const handleOk = () => {
  data.modelVisible = false
}
const userView = (record) => {
  data.recordCurrent = record
  data.userVisible = true
}

// 获取全部项目
const project_lst = async () => {
  try {
    let rsp = await PROJECT_LIST()
    data.tableData = []
    if (rsp.data.items && rsp.data.items.length > 0) {
      data.tableData = []
      rsp.data.items.forEach((item, idx) => {
        let utime = new Date(item.meta.updated_at * 1000)
        let project = {
          key: idx,
          idx: idx,
          project_id: item.spec.project_id,
          updated_at: utime.toLocaleString(),
          cluster_name: item.spec.cluster_name,
          project_code: item.spec.project_code,
          project_desc: item.spec.project_desc,
          project_line: item.spec.project_line,
          users: item.spec.users
        }
        data.tableData.push(project)
      })
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  project_lst()
})
</script>
<style scoped>
.header,
.content {
  padding: 10px;
}

.header {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.header .sync {
  align-self: flex-end;
  margin-right: 10px;
}
</style>
