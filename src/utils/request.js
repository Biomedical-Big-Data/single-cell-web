import axios from "axios"
import { message } from "ant-design-vue"
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
})

request.interceptors.request.use(
  (config) => {
    if (userStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${userStore.user.access_token}`
    }
    return config
  },
  (error) => {
    console.error(error)
  },
)

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.status) {
      if (res.status === "0000") {
        return res.data
      } else {
        message.error(res.message)
        return Promise.reject(res.message)
      }
    } else {
      return res
    }
  },
  async (error) => {
    const msg = error.response?.data?.message || error.message
    await message.error(msg)
    return Promise.reject(error)
  },
)

export default request
