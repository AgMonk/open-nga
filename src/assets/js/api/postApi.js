import {ElMessage} from "element-plus";
import {ngaRequest} from "@/assets/js/api/nga-request";

// 回复准备
export const prePost = ({fid, tid, pid, action}) => {
    return ngaRequest.post({
        fid, tid, pid, action,
        _newui:""
    }).then(res => {
        console.log(res)
        return res.data;
    })
}
// 评论准备
export const preComment = ({fid, tid, pid}) => {
    return ngaRequest.post({
        fid, tid, pid, action:"reply",
        comment:1,
    }).then(res => {
        console.log(res)
        return res.data;
    })
}


// 发帖
export const doPost = function ({fid, tid, pid, action, post_subject, attachments, attachments_check,post_content}) {
    let params = {...arguments[0], step: 2};
    // 删除 值为0 的参数
    Object.keys(params).forEach(key=>{
        if (params[key] === 0 || params[key] === "0" || params[key]==='') {
            delete params[key];
        }
    })
    return ngaRequest.post(params).then(res=>{
        let error = res.error;
        if (error && !error[0].includes("发贴完毕")) {
            ElMessage.error(error[0])
            throw error
        }
        ElMessage.success( res.data.__MESSAGE["1"])
        /// /read.php?tid=25209388&_ff=-993945&page=e#pid523904675Anchor
        // 发帖成功 解析返回数据
        let link = res.data.__MESSAGE["6"]
            .replace("/read.php?","")
            .replace("Anchor","")
            .replace("_ff","fid")
            .replace("#pid","&pid=")
        let response ={}
        link.split("&").forEach(param=>{
            let p = param.split("=");
            response[p[0]]=p[1]
        })
        return response
    })
}

let f = function (p1, p2) {
    console.log(arguments[0])
}