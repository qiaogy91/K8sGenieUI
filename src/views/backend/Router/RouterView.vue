<template>
  <div class="header">
    <a-row :size="24">
      <a-col :span="2">
        <a-button type="primary" :loading="false" @click="data.modelVisible = true">
          <template #icon>
            <icon-plus />
          </template>
          Click Me
        </a-button>
      </a-col>
      <a-col :span="21">
        <a-space>
            <a-select v-model="data.queryType" placeholder="select ..." allow-clear>
              <a-option value="1">查询所有</a-option>
              <a-option value="2">集群编码</a-option>
              <a-option value="3">产线名称</a-option>
              <a-option value="4">项目ID</a-option>
            </a-select>
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
        </a-space>
      </a-col>
      <a-col :span="1">
        <div style="align-self: flex-end">
          <json-excel
            :data="data.tableData"
            name="data.xlsx"
          >
            <a-button type="primary"><template #icon><icon-download /></template></a-button>
          </json-excel>
        </div>
      </a-col>

    </a-row>
    <a-space>



    </a-space>
  </div>

  <div class="content">
    <a-table :columns="data.tableColumns" :data="data.tableData">
      <template #ops="{ record }">
        <a-space>
          <a-button status="success" @click="route_desc(record.metaId)" type="outline"
            >编辑
          </a-button>
          <a-button status="warning" @click="route_delete(record.metaId)" type="outline"
          >删除
          </a-button>
        </a-space>
      </template>
      <template #urgent="{ record }">
        <a-space size="large">
          <a-switch v-model="record.urgent_call" @change="urgentChange(record)"  />
        </a-space>
      </template>
    </a-table>
  </div>

  <div>
    <a-modal
      v-model:visible="data.modelVisible"
      @ok="route_create"
      @cancel="route_cancel"
      fullscreen
    >
      <template #title> Title</template>
      <div>
        <a-form :model="data.routeData" :style="{ width: '600px' }" auto-label-width>
          <a-form-item field="identity" label="项目标识符">
            <a-input v-model="data.routeData.identity" placeholder="项目标识符" />
          </a-form-item>

          <a-form-item field="webhook" label="机器人 Webhook">
            <a-input v-model="data.routeData.webhook_url" placeholder="机器人url" />
          </a-form-item>
          <a-form-item field="token" label="机器人 Token">
            <a-input v-model="data.routeData.webhook_token" placeholder="token" />
          </a-form-item>

          <a-divider orientation="right" style="width: 600px"></a-divider>

          <div>
            <a-form-item field="urgent_call" label="启用电话加急">
              <a-checkbox v-model="data.routeData.urgent_call"></a-checkbox>
            </a-form-item>

            <a-form :model="data.tempUser" :style="{ width: '600px' }">
              <a-form-item
                label="新建用户"
                :content-flex="false"
                :merge-props="false"
              >
                <a-row :gutter="8">
                  <a-col :span="10">
                    <a-form-item field="together.firstname" validate-trigger="input" no-style>
                      <a-input v-model="data.tempUser.username" placeholder="LDAP username" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="10">
                    <a-form-item field="together.lastname" validate-trigger="input" no-style>
                      <a-input v-model="data.tempUser.phone" placeholder="phone number" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="4">
                    <a-button type="primary" @click="addTempUser">
                      <template #icon>
                        <icon-plus />
                      </template>
                      增加
                    </a-button>
                  </a-col>
                </a-row>

              </a-form-item>
            </a-form>
          </div>

          <div>
            <a-form-item field="urgent_call" label="人员列表">

              <a-space>
                <div v-for="(item,index) in data.routeData.users" :key="index">
                  <a-tag closable @close="popTempUser(item)">{{item.username}}-{{item.phone}}</a-tag>
                </div>
              </a-space>
            </a-form-item>

          </div>
        </a-form>
      </div>


    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { ROUTE_CREATE, ROUTE_DELETE, ROUTE_QUERY, ROUTE_UPDATE, ROUTE_URGENT } from '@/api/route.js'

const data = reactive({
  updateRouteId: undefined,
  queryType: "1",
  queryKeyword: '',
  tableColumns: [
    { title: '序号', dataIndex: 'idx' },
    { title: '更新时间', dataIndex: 'updated_at' },
    { title: '告警目标 / 项目ID', dataIndex: 'identity' },
    { title: '所属集群', dataIndex: 'cluster_name' },
    { title: '所属产线', dataIndex: 'project_line' },
    { title: '所属项目', dataIndex: 'project_desc' },
    { title: '项目编码', dataIndex: 'project_code' },
    { title: 'WebHook', dataIndex: 'webhook_url' },
    { title: '加急', slotName: 'urgent' },
    { title: '操作', slotName: 'ops' }
  ],
  tableData: [],
  modelVisible: false,
  routeData: {
    identity: '',
    webhook_url: '',
    webhook_token: '',
    urgent_call: false,
    users: []
  },
  tempUser: {
    username: '',
    phone: ''
  }
})

const addTempUser = async () =>{
  if (!data.routeData.users) {
    data.routeData.users = []
  }
  data.routeData.users.push(data.tempUser)
  data.tempUser = {
    username: '',
    phone: ''
  }
}

const popTempUser = async (item) =>{
  console.log(item)
  data.routeData.users = data.routeData.users.filter(user => user.username !== item.username || user.phone !== item.phone);
}

const routeQuery = async (t, k) => {
  try {
    let rsp = await ROUTE_QUERY(t, k)
    data.tableData = []
    if (rsp.data.items && rsp.data.items.length > 0) {
      rsp.data.items.forEach((item, idx) => {
        // let ctime = new Date(item.meta.created_at * 1000)
        let utime = new Date(item.meta.updated_at * 1000)


        let r = {
          idx: idx,
          // created_at: ctime.toLocaleString(),
          updated_at: utime.toLocaleString(),
          identity: item.spec.identity,
          webhook_token: item.spec.webhook_token,
          webhook_url: item.spec.webhook_url.split('/').pop(),
          urgent_call: item.spec.urgent_call,
          cluster_name: "",
          project_line: "",
          project_code: "",
          project_desc: "",

        }
        if (item.spec.project_spec) {
          r.cluster_name = item.spec.project_spec.cluster_name
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

    if (data.updateRouteId) {
      await ROUTE_UPDATE(data.updateRouteId, data.routeData)
      // 重置数据
      data.routeData =  {
        identity: '',
          webhook_url: '',
          webhook_token: '',
          urgent_call: false,
          users: []
      }
      Message.success('更新成功')
      // data.updateRouteId = undefined
    }else {
      await ROUTE_CREATE(data.routeData)
      Message.success('创建成功')
    }



  } catch (err) {
    Message.error(err)
    console.log(err)
  }
  routeQuery('1', '')
}
const route_delete = async (id) => {
  try {
    let rsp = await ROUTE_DELETE(id)
    console.log(rsp)
  } catch (err) {
    console.log(err)
    Message.error(err)
  }
  routeQuery('1', '')
}


// 详情查看、路由更新
const route_desc = async (id) =>{
  data.updateRouteId = id
  try {
    let rsp = await ROUTE_QUERY(4, id)
    data.routeData = rsp.data.items[0].spec
    data.modelVisible = true
  }catch (err){
    console.log(err)
    Message.error(err)
  }
}



const route_cancel = async () => {
  data.routeData = {}
  data.modelVisible = false
}

onMounted(() => {
  routeQuery('1', '')
})

const urgentChange = async (r) => {
  console.log(r.metaId, r.urgent_call)

  try {
    await ROUTE_URGENT({"id": r.metaId.toString(), "urgent_call": r.urgent_call})
    Message.success("操作成功")
  }catch (err) {
    console.log(err)
  }
}

</script>

<style scoped>
.header {
  padding: 10px;
  //display: flex;
}

.content {
  padding: 10px;
}
</style>
