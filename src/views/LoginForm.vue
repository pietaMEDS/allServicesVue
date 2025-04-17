<script setup>
import { ref } from 'vue'
import { useDevStore } from '@/stores/dev.js'
import { useAuthStore } from '@/stores/auth.js'
import router from '@/router/index.js'

const login = ref('')
const password = ref('')
const isLoading = ref(false);

const defaultRules = [
  value => !!value || 'Обязательное поле.',
  value => (value && value.length >= 3) || 'Минимальное количество символов 3',
]

const formSubmit = async () => {
  isLoading.value = true
  try{
    const response = await fetch(`${useDevStore().apiHost}/users/auth`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login.value,
          password: password.value,
        })
      }
    )
    const data = await response.json()
    if (data.status === 'OK') {
      useAuthStore().setToken(data.token)
      router.push('/cabinet')
    }
  }
  catch (error) {
    console.error(`formSubmit error:`,error)
  }
  isLoading.value = false
}

</script>

<template>
<div class="container">
  <div class="form">
    <div class="form-item">
      <v-text-field
        v-model="login"
        :rules="defaultRules"
        label="Логин"
      ></v-text-field>
    </div>
    <div class="form-item">
      <v-text-field
        v-model="password"
        :rules="defaultRules"
        label="Пароль"
      ></v-text-field>
    </div>
    <div class="form-item">
      <v-btn
        :loading="isLoading"
        @click="formSubmit"
      >Войти</v-btn>
    </div>
  </div>
</div>
</template>

<style scoped>
.container {

  .form{
    border: 1px solid blue;
  }
  .form-item{
    display: flex;
    padding: 15px;
  }
}
</style>
