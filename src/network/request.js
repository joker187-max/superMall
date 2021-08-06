import axios from "axios";

export function request(config) {
  //  1 创建axios 的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })
  //  2 axios请求的拦截
  instance.interceptors.request.use(config => {
    return config
  }, error => {

  })
  //  3 axios响应的拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err)
  })

  //  4 发送真正的请求
  return instance(config)

}
