<template>
  <a-layout class="layout-demo">
    <a-layout-sider collapsible breakpoint="xl">
      <div class="logo"/>
      <a-menu
        :default-open-keys="['1']"
        :default-selected-keys="['0_3']"
        :style="{ width: '100%' }"
        @menu-item-click="onClickMenuItem"
      >
        <div v-for="menu in data.menuArr" :key="menu.id">
          <div v-if="menu.children.length === 0">
            <a-menu-item :key="menu.url">
              <IconHome></IconHome>
              {{ menu.title }}
            </a-menu-item>
          </div>
          <div v-else>
            <a-sub-menu :key="menu.id">
              <template #title>
                <IconCalendar></IconCalendar>
                {{ menu.title }}
              </template>
              <div v-for="child in menu.children" :key="child.id">
                <a-menu-item :key="child.url">{{ child.title }}</a-menu-item>
              </div>
            </a-sub-menu>
          </div>
        </div>
      </a-menu>
      <!-- trigger -->
      <template #trigger="{ collapsed }">
        <IconCaretRight v-if="collapsed"></IconCaretRight>
        <IconCaretLeft v-else></IconCaretLeft>
      </template>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="padding-right: 20px;">
        <div style="margin-right: 20px">
          <a-avatar>{{username}}</a-avatar>
        </div>

        <div class="header">
          <a-button type="primary" @click="Logout">退出</a-button>
        </div>
      </a-layout-header>

      <a-layout style="padding: 0 24px;">
<!--        <a-breadcrumb :style="{ margin: '16px 0' }">-->
<!--          <a-breadcrumb-item>Home</a-breadcrumb-item>-->
<!--          <a-breadcrumb-item>List</a-breadcrumb-item>-->
<!--          <a-breadcrumb-item>App</a-breadcrumb-item>-->
<!--        </a-breadcrumb>-->
        <a-layout-content style="margin-top: 10px">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
import {reactive} from "vue";
import {Message} from '@arco-design/web-vue';
import {IconCaretRight, IconCaretLeft, IconHome, IconCalendar,} from '@arco-design/web-vue/es/icon';
import {useRouter} from 'vue-router'

const store = useLocalStore()
const router = useRouter()

const onClickMenuItem = (key) => {
  // Message.info({content: `You select ${key}`, showIcon: true});
  router.push({ name: key })
}

const username = store.userName

const data = reactive({
  menuArr: [
    {
      id: 1, title: "信息面板", url: "dashboard", children: [

      ]
    },
    {
      id: 2, title: "项目管理", url: "project", children: []
    },
    {
      id: 3, title: "负载管理", url: "workload", children: []
    },
    {
      id: 4, title: "用户管理", url: "user", children: []
    },
    {
      id: 5, title: "路由管理", url: "router", children: []
    },
    {
      id: 6, title: "数据报表", url: "", children: [
        {
          id: 61, title: "集群产线", url: "clusterRecord", children: []
        },
        {
          id: 62, title: "产线项目", url: "projectRecord", children: []
        },
        {
          id: 63, title: "项目详细", url: "namespaceRecord", children: []
        },
      ]
    },
  ]
})


import {useLocalStore} from "@/stores/localStorage.js";


const Logout = ()=>{
  store.$reset()
  router.push({name: "login"})
}

</script>
<style scoped>
.layout-demo {
  height: 100vh;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
}

.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  background: rgba(255, 255, 255, 0.2);
}

.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}

.layout-demo :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
  display: flex;
  justify-content: right;
}

.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}

.layout-demo :deep(.arco-layout-content) {
  /*color: var(--color-text-2);*/
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  /*justify-content: center;*/
  /*color: var(--color-white);*/
  font-size: 16px;
  font-stretch: condensed;
  /*text-align: center;*/
}
</style>