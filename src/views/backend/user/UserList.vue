<script setup>
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { USER_LIST, USER_CREATE } from '@/api/user.js'
import { onMounted, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'

const userCreate = () => {}

const data = reactive({
  tableColumns: [
    { title: '序号', dataIndex: 'idx' },
    { title: '登录名', dataIndex: 'username' },
    { title: '密码', dataIndex: 'password' },
    { title: '描述', dataIndex: 'desc' },
    { title: '创建时间', dataIndex: 'created_at' },
    { title: '更新时间', dataIndex: 'updated_at' },
    { title: '操作', slotName: 'optional' }
  ],
  tableData: [],
  modelVisible: false,
  userForm: {
    username: '',
    password: '',
    desc: ''
  }
})

const modelOpen = () => {
  data.modelVisible = true
}

const modelClose = () => {
  data.modelVisible = false
  data.userForm = {}
}

const user_query = async () => {
  data.tableData = []
  try {
    let rsp = await USER_LIST()
    rsp.data.items.forEach((item, idx) => {
      let ctime = new Date(item.meta.created_at * 1000)
      let utime = new Date(item.meta.updated_at * 1000)
      let user = {
        idx: idx,
        id: item.meta.id,
        username: item.spec.username,
        password: '********',
        desc: item.spec.desc,
        created_at: ctime.toLocaleString(),
        updated_at: utime.toLocaleString(),
      }
      data.tableData.push(user)
    })
  } catch (error) {
    console.log(error)
    Message.error(error)
  }
}

const user_create = async () => {
  try {
    let rsp = await USER_CREATE(data.userForm)
    let ctime = new Date(rsp.data.meta.created_at * 1000)
    let utime = new Date(rsp.data.meta.updated_at * 1000)
    data.tableData.push({
      idx: data.tableData.length,
      id: rsp.data.meta.id,
      username: rsp.data.spec.username,
      password: '********',
      desc: rsp.data.spec.desc,
      created_at: ctime.toLocaleString(),
      updated_at: utime.toLocaleString(),
    })

    Message.success("创建成功")

  } catch (error) {
    console.log(error)
    Message.error(error.error)
  }
}

onMounted(() => {
  user_query()
})
</script>

<template>
  <div class="header">
    <a-button type="primary" @click="modelOpen">
      <template #icon>
        <icon-plus />
      </template>
      创建用户
    </a-button>

    <a-input-search
      :style="{ width: '320px' }"
      placeholder="Please enter something"
      search-button
    />
  </div>

  <div class="content">
    <a-table :columns="data.tableColumns" :data="data.tableData">
      <template #optional="{ record }">
        <a-button @click="modelOpen">编辑</a-button>
      </template>
    </a-table>
  </div>

  <a-modal v-model:visible="data.modelVisible" title="创建用户" @cancel="modelClose" @ok="user_create">
    <a-form :model="data.userForm">
      <a-form-item field="name" label="UserName">
        <a-input v-model="data.userForm.username" />
      </a-form-item>
      <a-form-item field="name" label="Password">
        <a-input v-model="data.userForm.password" />
      </a-form-item>
      <a-form-item field="name" label="Description">
        <a-input v-model="data.userForm.desc" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.header,
.content {
  padding: 10px;
}
</style>
