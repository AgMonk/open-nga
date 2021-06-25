// noinspection JSCheckFunctionSignatures,SpellCheckingInspection

import axios from "axios";
import {ElMessage} from "element-plus";

export const requestUnity = axios.create({
    baseURL: "/api/",
    timeout: 5000,
    method: "post",
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Cache-Control": "max-age=0",
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
        __output: 8,
        __inchst: "UTF8",
    },
    // 配合Form-Data传递参数
    transformRequest: [
        function (data) {
            let ret = ''
            for (let it in data) {
                if (data.hasOwnProperty(it)) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
            }
            ret = ret.substring(0, ret.lastIndexOf('&'));
            return ret
        }
    ],
    responseType: 'blob',
    // 解析GBK编码的响应数据 并处理一些不严格的json字符串
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
                    while (res = r1.exec(result)) {
                        let startIndex = res.index
                        let endIndex = startIndex + res[0].indexOf(":")
                        result = result.substring(0, startIndex)
                            + `"` + result.substring(startIndex, endIndex).trim()
                            + `"` + result.substring(endIndex)
                    }
                    while (res = r2.exec(result)) {
                        let startIndex = res.index
                        let endIndex = startIndex + res[0].indexOf(":")
                        startIndex++
                        result = result.substring(0, startIndex)
                            + `"` + result.substring(startIndex, endIndex).trim()
                            + `"` + result.substring(endIndex)
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

let handleError = (res) => {
    let error = res.error;
    if (error) {
        ElMessage.error(error[0])
        throw error
    }
}


// 添加请求拦截器
requestUnity.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
requestUnity.interceptors.response.use(function (response) {
    let res = response.data;
    handleError(res)
    return res
}, (error) => {
    handleError(error.response)
    return Promise.reject(error);
});

export const obj2Array = (obj) => {
    let array = [];
    Object.keys(obj).forEach(key => {
        array.push(obj[key])
    })
    console.log(array)
    return array;
}


export const ngaRequest = {
    nuke(data) {
        return requestUnity({
            url: "nuke.php",
            data,
        })
    },
    thread({stid, fid, page, authorid, searchpost, favor}) {
        let map = {
            favor: {favor: 1},
            stid: {stid, page},
            authorid: {fid, page, authorid, searchpost},
            fid: {fid, page},
        }
        let data;
        if (favor) {
            data = map.favor;
        } else if (stid) {
            data = map.stid;
        } else if (authorid) {
            data = map.authorid;
        } else if (fid) {
            data = map.fid;
        }
        return requestUnity({
            url: "thread.php",
            data,
        }).then(res=>{
            delete res.encode;
            return res;
        })
    }

}
