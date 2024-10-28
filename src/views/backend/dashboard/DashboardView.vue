<template>
  <div style="margin: 10px">
    <a-row>
      <a-col :span="8">
        <a-space direction="vertical">
          <a-select :style="{width:'200px'}" placeholder="选择集群" v-model="data.search.clusterName">
            <a-option value="crc-itcp-test-03">crc-itcp-test-03</a-option>
            <a-option value="crc-itcp-prd-02">crc-itcp-prd-02</a-option>
            <a-option value="itcp-k8s-uat">itcp-k8s-uat</a-option>
            <a-option value="itcp-k8s-prd">itcp-k8s-prd</a-option>
            <a-option value="itcp-k8s-xc-uat">itcp-k8s-xc-uat</a-option>
            <a-option value="itcp-k8s-xc-uat">itcp-k8s-xc-prd</a-option>
          </a-select>
        </a-space>

        <a-space direction="vertical" size="large">
          <a-input-group>
            <a-month-picker style="width: 200px;" v-model="data.search.month" format="YYYY-MM"/>
            <a-button type="primary" @click="clusterDashboardSearch">
              <template #icon>
                <icon-search />
              </template>
              <template #default>Search</template>
            </a-button>
          </a-input-group>
        </a-space>
      </a-col>

      <a-col :span="8">
        <a-space direction="vertical" size="large">
          <a-input-group>
            <a-input
              :style="{ width: '200px' }"
              placeholder="产线名称"
              allow-clear
              v-model="data.search.projectLine"
            />
            <a-button type="primary" @click="projectDashboardSearch">
              <template #icon>
                <icon-search />
              </template>
              <template #default>Search</template>
            </a-button>
          </a-input-group>
        </a-space>
      </a-col>
      <a-col :span="8">
        <a-input-group>
        <a-input
          :style="{ width: '200px' }"
          placeholder="项目编码"
          allow-clear
          v-model="data.search.projectCode"
        />
          <a-date-picker style="width: 200px" v-model="data.search.createdTime" />
        <a-button type="primary" @click="namespaceDashboardSearch">
          <template #icon>
            <icon-search />
          </template>
          <template #default>Search</template>
        </a-button>
        </a-input-group>
      </a-col>
    </a-row>

  </div>


  <div style="margin: 5px">
    <a-row :size="24">
      <a-col :span="12">
        <div style="width: 50vw; height: 50vh">
          <v-chart :option="clusterDashboard" autoresize :loading="false"></v-chart>
        </div>
      </a-col>
      <a-col :span="12">
        <div style="width: 50vw; height: 50vh">
          <v-chart :option="projectDashboard" autoresize :loading="false"></v-chart>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <div style="width: 100vw; height: 50vh">
        <v-chart :option="namespaceDashboard" autoresize :loading="false"></v-chart>
      </div>
    </a-row>
  </div>

</template>

<script setup>
import { onMounted, reactive } from 'vue'
import {CLUSTER_RECORD, PROJECT_RECORD, NAMESPACE_RECORD} from '@/api/record.js'


const data = reactive({
  search: {
    month: "2024-10",
    clusterName: "crc-itcp-test-03",
    projectLine: '协同效率',
    projectCode: 'odms',
    createdTime: '2024-10-25',

  }
})

const clusterDashboard = reactive({
  title: {
    text: '集群资源用量视图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const clusterDashboardSearch = async ()=>{
  let res = await CLUSTER_RECORD(data.search.month, data.search.clusterName)
  console.log(res.data)

  clusterDashboard.series[0].data = []

  res.data.forEach((item) => {
    let dic = {
      value: item.weight,
      name: item.project_line,
    }
    clusterDashboard.series[0].data.push(dic)
  })
}


const projectDashboard = reactive({
  title: {
    text: '项目资源用量视图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const projectDashboardSearch = async ()=>{
  let res = await PROJECT_RECORD(data.search.month, data.search.clusterName, data.search.projectLine)

  projectDashboard.series[0].data = []
  res.data.forEach((item) => {
    let dic = {
      name: item.project_wight.project_code,
      value: item.project_wight.weight,
    }
    projectDashboard.series[0].data.push(dic)
  })
}


const namespaceDashboard = reactive({
  title: {
    text: '项目内名称空间用量分布'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '1%',
    right: '5%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.2]
  },
  yAxis: {
    type: 'category',
    data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
  },
  series: [
    {
      name: data.search.projectCode,
      type: 'bar',
      data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
  ]
})

const namespaceDashboardSearch = async ()=>{
  let res = await NAMESPACE_RECORD(data.search.createdTime, data.search.clusterName, data.search.projectLine, data.search.projectCode)
  data.tableData = []
  namespaceDashboard.yAxis.data = []
  namespaceDashboard.series[0].data = []

  res.data.forEach((item) => {
    namespaceDashboard.series[0].data.push(item.namespace_wight.weight)
    namespaceDashboard.yAxis.data.push(item.namespace_wight.namespace)
  })
}
onMounted(async ()=>{
  await clusterDashboardSearch()
  await projectDashboardSearch()
  await namespaceDashboardSearch()
})
</script>

<style scoped></style>
