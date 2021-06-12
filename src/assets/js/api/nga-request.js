import axios from "axios";
import {ElMessage} from 'element-plus';

function onRejected(error) {
    // 对响应错误做点什么
    let data = error.response.data;
    console.log(data)
    ElMessage.error(data.error[0])
    return Promise.reject(error);
}

export const request = axios.create({
    baseURL: "/api/",
    timeout: 5000,
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Cache-Control": "max-age=0",
    },
    params: {
        __output: 11,
        __inchst: "UTF8",

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
    let error = response.data.error;
    if (error) {
        ElMessage.error(error[0])
        throw error
    }

    return response.data
}, onRejected);

export const request8 = axios.create({
    baseURL: "/api/",
    timeout: 5000,
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Cache-Control": "max-age=0",
    },
    params: {
        __output: 8,
        __inchst: "UTF8",

    },
    responseType: 'blob',
    transformResponse: [function (data) {
        let reader = new FileReader();
        reader.readAsText(data, 'GBK');
        return new Promise(resolve => {
            reader.onload = function () {
                // console.log(reader.result);
                let result = reader.result;
                while (result.includes("	")) {
                    result = result.replace("	", "")
                }
                while (result.includes("\t")) {
                    result = result.replace("\t", "")
                }
                // noinspection JSCheckFunctionSignatures
                resolve(JSON.parse(result))
            }
        });
    }]
})
// 添加请求拦截器

request8.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器


request8.interceptors.response.use(function (response) {
    let error = response.data.error;
    if (error) {
        ElMessage.error(error[0])
        throw error
    }
    return response.data
}, onRejected);
