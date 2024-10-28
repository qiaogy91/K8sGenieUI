<template>
  <div class="header">
    <a-space>
      <div width="200px">
        <a-button type="primary" :loading="false" @click="data.modelVisible = true">
          <template #icon>
            <icon-plus />
          </template>
          Click Me
        </a-button>
      </div>

      <div style="display: flex; flex-grow: 1">
        <div>
          <a-select v-model="data.queryType" placeholder="select ..." allow-clear>
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
            @search="routeQuery(data.queryType, data.queryKeyword)"
            @press-enter="routeQuery(data.queryType, data.queryKeyword)"
          >
            <template #button-icon>
              <icon-search />
            </template>
            <template #button-default> Search</template>
          </a-input-search>
        </div>
      </div>
    </a-space>
  </div>

  <div class="content">
    <a-table :columns="data.tableColumns" :data="data.tableData">
      <template #optional="{ record }">
        <a-space>
          <a-button status="warning" @click="route_delete(record.metaId)" type="outline">Delete</a-button>
        </a-space>
      </template>
    </a-table>
  </div>

  <div>
    <a-modal v-model:visible="data.modelVisible" @ok="route_create" @cancel="route_cancel">
      <template #title> Title </template>
      <div>
        <a-form :model="data.routeData" :style="{width:'450px'}" auto-label-width>
          <a-form-item field="identity" label="identity">
            <a-input v-model="data.routeData.identity" placeholder="项目标识符" />
          </a-form-item>


          <a-form-item field="webhook" label="webhook">
            <a-input v-model="data.routeData.webhook_url" placeholder="机器人url" />
          </a-form-item>
          <a-form-item field="token" label="token">
            <a-input v-model="data.routeData.webhook_token" placeholder="token" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { ROUTE_CREATE, ROUTE_DELETE, ROUTE_QUERY } from '@/api/route.js'

const data = reactive({
  queryType: undefined,
  queryKeyword: '',
  tableColumns: [
    { title: '序号', dataIndex: 'idx' },
    { title: '创建时间', dataIndex: 'created_at' },
    { title: '告警目标', dataIndex: 'identity' },
    { title: '所属产线', dataIndex: 'project_line' },
    { title: '所属项目', dataIndex: 'project_desc' },
    { title: '项目编码', dataIndex: 'project_code' },
    { title: 'WebHook', dataIndex: 'webhook_url' },
    { title: '详情', slotName: 'optional' }
  ],
  tableData: [],
  modelVisible: false,
  routeData : {
    identity: "",
    webhook_url: "",
    webhook_token: ""
  },
})

const routeQuery = async (t, k) => {
  try {
    let rsp = await ROUTE_QUERY(t, k)

    data.tableData = []
    if (rsp.data.items && rsp.data.items.length > 0) {
      rsp.data.items.forEach((item, idx) => {
        let ctime = new Date(item.meta.created_at * 1000)
        let r = {
          idx: idx,
          created_at: ctime.toLocaleString(),
          identity: item.spec.identity,
          webhook_token: item.spec.webhook_token,
          webhook_url: item.spec.webhook_url
        }
        if (item.spec.project_spec) {
          r.project_line = item.spec.project_spec.project_line
          r.project_code = item.spec.project_spec.project_code
          r.project_desc = item.spec.project_spec.project_desc

        }
        r.metaId = item.meta.id
        data.tableData.push(r)
      })
    }
  } catch (err) {
    console.log(err)
    Message.error(err)
  }
}

const route_create = async () => {
  try {
    await ROUTE_CREATE(data.routeData)
    Message.success("创建成功")
  }catch (err){
    Message.error(err)
    console.log(err)
  }
  routeQuery('1', '')
}
const route_delete = async (id)=>{
  try {
    let rsp = await ROUTE_DELETE(id)
    console.log(rsp)
  }catch (err){
    console.log(err)
    Message.error(err)
  }
  routeQuery('1', '')
}
const route_cancel = async () => {
  data.routeData = {}
  data.modelVisible = false
}
onMounted(() => {
  routeQuery('1', '')
})
</script>

<style scoped>
.header {
  padding: 10px;
  display: flex;
}

.content {
  padding: 10px;
}
</style>
