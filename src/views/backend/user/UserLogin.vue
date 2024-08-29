<template>
  <div class="content">
    <a-form :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
      <a-form-item field="name" label="用户名">
        <a-input v-model="form.username" placeholder="please enter your username..." />
      </a-form-item>

      <a-form-item field="post" label="密码">
        <!--        <a-input  v-model="form.password" placeholder="please enter your password"/>-->
        <a-input-password autocomplete="off" v-model:visibility="visibility" placeholder="please enter your password" :defaultVisibility="false" allow-clear
          v-model="form.password"
        />
      </a-form-item>

      <a-form-item field="isRead">
        <a-checkbox v-model="form.isRead"> 记住我</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
  {{ form }}
</template>

<script setup>
import { reactive, ref } from 'vue'
import { USER_LOGIN } from '@/api/user.js'
import { Message } from '@arco-design/web-vue'
import { useLocalStore } from '@/stores/localStorage.js'
import { useRouter } from 'vue-router'

const visibility = ref(true)
const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const router = useRouter()
const store = useLocalStore()

const handleSubmit = async () => {
  try {
    let rsp = await USER_LOGIN(form)
    Message.success('登录成功')

    store.$patch({
      isLogin: true,
      userName: rsp.data.username,
      accessToken: rsp.data.access_token,
      refreshToken: rsp.data.refresh_token
    })

    await router.push({ name: 'backend' })
  } catch (err) {
    Message.error(err.error)
  }
}
</script>

<style scoped>
.content {
  background: #7f7fd5;
  background: -webkit-linear-gradient(to right, #91eae4, #86a8e7, #7f7fd5);
  background: linear-gradient(to right, #91eae4, #86a8e7, #7f7fd5);

  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
</style>
