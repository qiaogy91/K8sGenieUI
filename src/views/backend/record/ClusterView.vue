

<template>
  <div style="margin: 10px">
    <a-row>
      <a-col :span="23">
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
      <a-table :columns="data.tableColumns" :data="data.tableData" :pagination="pagination"/>
  </div>

</template>
<script setup>
import {DatePicker}    from '@arco-design/web-vue'
import {IconSearch} from '@arco-design/web-vue/es/icon/index.js'
import { reactive, ref } from 'vue'
import {CLUSTER_RECORD} from '@/api/record.js'

const pagination = ref({
  pageSize: 30,    // 设置默认每页显示 10 条
  current: 1,      // 设置当前页码为 1
  showTotal: true, // 显示总数
});

const data = reactive({
  search: {
    month: "",
    clusterName: ""
  },
  tableColumns: [
    {"title": "序号", dataIndex: "idx"},
    {"title": "统计月份", dataIndex: "month"},
    {"title": "集群名称", dataIndex: "cluster"},
    {"title": "产线名称", dataIndex: "line"},
    {"title": "用量权重", dataIndex: "weight"},


  ],
  tableData: [],
})

const search = async () => {
  console.log(data.search)
  let res = await CLUSTER_RECORD(data.search.month, data.search.clusterName)
  console.log(res.data)

  data.tableData = []
  res.data.forEach((item, idx) => {
    let dic = {
      idx: idx +1,
      cluster: item.cluster_name,
      line: item.project_line,
      month: data.search.month,
      weight: item.weight,
    }
    data.tableData.push(dic)
  })
}
</script>

<style scoped>

</style>