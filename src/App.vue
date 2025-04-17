<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { onMounted } from 'vue'

onMounted(async () => {
  useAuthStore().getTokenFromSession()
})
</script>

<template>
  <header class="header">
    <ul>
      <li>
        <RouterLink :to="{name: 'products'}">
          <v-btn>
            Каталог
          </v-btn>
        </RouterLink>
      </li>
      <li>
        <RouterLink v-if="useAuthStore().token" :to="{name: 'cabinet'}">
          <v-btn>
            Кабинет
          </v-btn>
        </RouterLink>
        <RouterLink v-else :to="{name: 'authorization'}">
          <v-btn>
            Авторизация
          </v-btn>
        </RouterLink>
      </li>
    </ul>
  </header>
  <RouterView />
</template>

<style scoped>
.header {
  background-color: #1e1e1e;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #333;
}

.header ul {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.header li {
  display: flex;
  align-items: center;
}

</style>
