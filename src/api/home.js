import request from "@/utils/request.js"

// 获取首页数据
export const getHomeData = () => {
  return request({
    url: "/project/homepage",
    method: "get",
  })
}
