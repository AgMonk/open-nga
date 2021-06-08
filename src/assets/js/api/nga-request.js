import axios from "axios";
import {ElMessage} from 'element-plus';

export const request = axios.create({
    baseURL: "/api/",
    timeout: 5000,
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Cache-Control": "max-age=0",
    },
    params: {
        __output: 11
    }
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    let data = response.data;
    // console.log(data)
    return data
}, function (error) {
    // 对响应错误做点什么
    let data = error.response.data;
    console.log(data)
    ElMessage.error(data.error[0])
    return Promise.reject(error);
});
