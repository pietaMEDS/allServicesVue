import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
  }),

  actions: {
    getTokenFromSession() {
      this.token = sessionStorage.getItem('token')
    },

    setToken(token) {
      this.token = token
      sessionStorage.setItem('token', token)
    },

    clearToken() {
      this.token = null
      sessionStorage.removeItem('token')
    },

    isAuthenticated() {
      if (this.token == null) {
        return false
      }
      return !!this.token
    },

  },

  hydrate() {
    this.token = localStorage.getItem('token')
  },
})
