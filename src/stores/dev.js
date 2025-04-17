
import { defineStore } from 'pinia'

export const useDevStore = defineStore('dev', {
  state: () => ({
    apiHost: 'http://127.0.0.1:8000/api',
  }),
})
