import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return { isAuthenticated: false, user: {} }
  },
  getters: {
    getUser: (state) => state.user.user_info,
    getIsAuthenticated: (state) => state.isAuthenticated
  },
  actions: {
    setUser(user) {
      //解析的用户
      if (user) {
        this.isAuthenticated = true
        this.user = user
      } else {
        this.isAuthenticated = false
        this.user = {}
      }
    }
  },
  persist: true
})
