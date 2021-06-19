import axios from "axios";
import {ElMessage} from 'element-plus';

function onRejected(error) {
    // 对响应错误做点什么
    console.log(error.response)
    let data = error.response.data;
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

                if (result.includes("unread")) {
                //    对提醒消息特殊处理
                    result = result
                        .replace(/\s/g,"")
                        .replace(/15:/g,"\"15\":")
                        .replace(/14:/g,"\"14\":")
                        .replace(/13:/g,"\"13\":")
                        .replace(/12:/g,"\"12\":")
                        .replace(/11:/g,"\"11\":")
                        .replace(/10:/g,"\"10\":")
                        .replace(/0:/g,"\"0\":")
                        .replace(/1:/g,"\"1\":")
                        .replace(/2:/g,"\"2\":")
                        .replace(/3:/g,"\"3\":")
                        .replace(/4:/g,"\"4\":")
                        .replace(/5:/g,"\"5\":")
                        .replace(/6:/g,"\"6\":")
                        .replace(/7:/g,"\"7\":")
                        .replace(/8:/g,"\"8\":")
                        .replace(/9:/g,"\"9\":")
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
