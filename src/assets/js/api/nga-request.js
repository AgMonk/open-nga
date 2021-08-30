// noinspection JSCheckFunctionSignatures,SpellCheckingInspection

import axios from "axios";
import {ElMessage} from "element-plus";
import {parseThreadTypeBit} from "@/assets/js/api/bitUtils";

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
                if (error && !error[0].includes("发贴完毕")) {
                    console.log(error)
                    ElMessage.error(error[0])
                    reject(error)
                } else {
                    let message = json.data["__MESSAGE"];
                    if (message && /[审核隐藏锁定]/.exec(message[1])) {
                        ElMessage.error(message[1])
                        reject(message[1])
                    } else {
                        resolve(json)
                    }
                }
            }
        });
    }]
})


// 添加响应拦截器
requestUnity.interceptors.response.use(response => response.data, (error) => Promise.reject(error));
// 将对象转换为数组
export const obj2Array = (obj) => {
    let array = [];
    Object.keys(obj).forEach(key => {
        array.push(obj[key])
    })
    return array;
}
// 将unix秒专为 日期字符串
export const timestamp2String = (timestamp) => {
    return new Date(timestamp * 1000).format("yyyy-MM-dd hh:mm:ss")
}
// 打包返回对象
export const packageData = (res) => {
    let data = {
        data: res.data,
        error: res.error,
        timestamp: res.time,
        timeString: timestamp2String(res.time)
    }
    // console.log(data)
    return data;
}

export const encodeUTF8 = (str) => {
    let back = [];
    let byteSize = 0;
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            byteSize += 1;
            back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
            byteSize += 2;
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)))
        } else if ((0x800 <= code && code <= 0xd7ff)
            || (0xe000 <= code && code <= 0xffff)) {
            byteSize += 3;
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)))
        }
    }
    for (let i = 0; i < back.length; i++) {
        back[i] &= 0xff;
    }
    return back;
}


export const ngaRequest = {
    nuke(data) {
        return requestUnity({
            url: "nuke.php",
            data,
        })
    },
    thread({stid, fid, page, authorid, searchpost, favor, order_by, recommend}) {
        let map = {
            favor: {favor: 1, page},
            stid: {page, stid},
            authorid: {fid, page, authorid, searchpost},
            fid: {fid, page},
            recommend: {fid, page, recommend: 1},
        }
        let data;
        if (favor) {
            data = map.favor;
        } else if (recommend) {
            data = map.recommend;
        } else if (stid) {
            data = map.stid;
        } else if (authorid) {
            data = map.authorid;
            if (data.searchpost === "0") {
                delete data.searchpost;
            }
        } else if (fid) {
            data = map.fid;
        }

        if (order_by) {
            data.order_by = "postdatedesc";
        }

        return requestUnity({
            url: "thread.php",
            data
        }).then(res => {
            res.data.__T = obj2Array(res.data.__T);
            res.data.__T.forEach(thread => {
                thread.typeOfThread = parseThreadTypeBit(thread.type)
            })

            let subForums = res.data.__F.sub_forums;
            if (subForums) {
                let sf = [];
                res.data.__F.subForums = sf;
                Object.keys(subForums).forEach(key => {
                    if (key.startsWith("t")) {
                        //   主题合集
                        sf.push({type: "合集", name: subForums[key]["1"], stid: subForums[key]["0"]})
                    }
                    if (!isNaN(key)) {
                        //   子版面
                        sf.push({type: "版面", name: subForums[key]["1"], fid: subForums[key]["0"]})
                    }
                })
            }
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
        }).then(res => {
            if (res.error) {
                throw res.error["0"];
            }
            res.data.__R = obj2Array(res.data.__R);
            res.data.__R.forEach(reply => {
                if (reply.attachs) {
                    reply.attachs = obj2Array(reply.attachs);
                }
                reply.typeOfReply = parseThreadTypeBit(reply.type)
            })
            console.log(res)
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
            return res
        })
    },
    post(data) {
        return requestUnity({
            url: "post.php",
            data
        })
    }
}
