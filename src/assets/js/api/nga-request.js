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
                    let r1 = /\s\d{1,2}:/g;
                    let r2 = /,\d{1,2}:/g;
                    let res
                    while (res = r1.exec(result)){
                        let startIndex = res.index
                        let endIndex = startIndex + res[0].indexOf(":")
                        result = result.substring(0,startIndex)+`"`+result.substring(startIndex,endIndex).trim()+`"`+result.substring(endIndex)
                    }
                    while (res = r2.exec(result)){
                        let startIndex = res.index
                        let endIndex = startIndex + res[0].indexOf(":")
                        startIndex++
                        result = result.substring(0,startIndex)+`"`+result.substring(startIndex,endIndex).trim()+`"`+result.substring(endIndex)
                    }
                }

                // noinspection JSCheckFunctionSignatures
                let json;
                try {
                    json = JSON.parse(result);
                } catch (e) {
                    console.warn(e)
                    console.log(result)
                    throw e
                }
                resolve(json)
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
