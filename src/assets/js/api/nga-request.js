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
        return new Promise((resolve, reject) => {
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
                    console.log(result)
                    reject(e)
                }
                json = packageData(json)
                let error = json.error;
                if (error) {
                    ElMessage.error(error[0])
                    reject(error)
                } else {
                    resolve(json)
                }
            }
        });
    }]
})



// 添加响应拦截器
requestUnity.interceptors.response.use(response => response.data, (error) => Promise.reject(error));

export const obj2Array = (obj) => {
    let array = [];
    Object.keys(obj).forEach(key => {
        array.push(obj[key])
    })
    return array;
}

export const timestamp2String = (timestamp) => {
    return new Date(timestamp * 1000).format("yyyy-MM-dd hh:mm:ss")
}

export const packageData = (res) => {
    let data = {
        data: res.data,
        timestamp: res.time,
        timeString: timestamp2String(res.time)
    }
    // console.log(data)
    return data;
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
            stid: {fid, page, stid},
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
            data
        }).then(res=>{
            res.data.__T = obj2Array(res.data.__T);
            return res;
        })
    },
    read({pid, tid, page, authorid}) {
        let map = {
            pid: {pid},
            tid: {tid, page},
            authorid: {tid, page, authorid},
        }
        let data;
        if (pid) {
            data = map.pid;
        } else if (authorid) {
            data = map.authorid;
        } else if (tid) {
            data = map.tid;
        }
        return requestUnity({
            url: "read.php",
            data
        }).then(res=>{
            res.data.__R = obj2Array(res.data.__R);
            return res;
        })
    },
    forum(key) {
        return requestUnity({
            url: "forum.php",
            data: {
                key
            }
        }).then(res => {
            res.data = obj2Array(res.data);
            return data
        })
    },
    post(data) {
        return requestUnity({
            url: "post.php",
            data
        })
    }
}
