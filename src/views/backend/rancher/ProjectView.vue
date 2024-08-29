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
          <a-option value="2">项目编码</a-option>
          <a-option value="3">项目产线</a-option>
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
        <a-button type="primary" class="sync" @click="drawerOpen">执行同步</a-button>
      </div>
    </a-space>
  </div>
  <div class="content">
    <a-table :columns="data.tableColumns" :data="data.tableData">
      <template #optional="{ record }">
        <a-button @click="userView(record.users)">查看</a-button>
      </template>
    </a-table>
  </div>

  <div>
    <a-modal v-model:visible="data.userVisible" @ok="handleOk" @cancel="handleOk">
      <template #title> Title</template>
      <div v-for="item in data.userCurrent.split(',')" :key="item">
        {{ item }}
      </div>
    </a-modal>
  </div>

  <!-- 抽屉 -->
  <div>
    <a-drawer
      :width="340"
      :height="340"
      :visible="data.DrawerVisible"
      placement="top"
      @ok="drawerClose"
      @cancel="drawerClose"
      unmountOnClose
    >
      <template #title> Title</template>
      <div>
        You can customize modal body text by the current situation. This modal will be closed
        immediately once you press the OK button.
      </div>
    </a-drawer>
  </div>
</template>
<script setup>
import { PROJECT_LIST, PROJECT_QUERY } from '@/api/rancher.js'
import { onMounted, reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'

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
  userCurrent: '',

  // 抽屉：同步项目资源
  DrawerVisible: false
})

// TODO 数据同步
const drawerOpen = () => {
  data.DrawerVisible = true

}
const drawerClose = () => {
  data.DrawerVisible = false
}

// 条件查询
const project_query = async () => {
  console.log('project_query', data.queryType, data.queryKeyword)
  try {
    let rsp = await PROJECT_QUERY(data.queryType, data.queryKeyword)

    console.log(rsp.data)
    if (rsp.data.items && rsp.data.items.length > 0) {
      data.tableData = []
      rsp.data.items.forEach((item, idx) => {
        let utime = new Date(item.meta.updated_at * 1000)
        let project = {
          key: idx,
          idx: idx,
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
  data.userCurrent = record
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
