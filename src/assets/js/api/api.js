// noinspection SpellCheckingInspection

import {request, request8} from "@/assets/js/api/nga-request";
import axios from "axios";
import {ElMessage} from "element-plus";

export const thread = (params) => {
    return request8.get("thread.php", {
        params,
    }).then(res => {
        // noinspection JSUnresolvedVariable
        if (res.error) {
            ElMessage.error(res.error[0])
            throw res.error
        }
        return res.data
    })
}

export const read = (params) => {
    return request8.get("read.php", {
        params
    }).then(res => {
        return res.data
    })
}

export const userInfo = (uid) => {
    return request.get("nuke.php", {
        params: {
            __lib: "ucp",
            __act: "get",
            uid
        }
    })
}
//查询收藏版面列表
export const getFavForum = () => {
    return request.get("nuke.php", {
        params: {
            __lib: "forum_favor2",
            __act: "forum_favor",
            action: "get",
        }
    })
}
//添加收藏版面
export const addFavForum = (fid) => {
    return request.get("nuke.php", {
        params: {
            __lib: "forum_favor2",
            __act: "forum_favor",
            action: "add",
            fid
        }
    })
}
//添加收藏版面
export const delFavForum = (fid) => {
    return request.get("nuke.php", {
        params: {
            __lib: "forum_favor2",
            __act: "forum_favor",
            action: "del",
            fid
        }
    })
}

//关注 合集或子版面
export const follow = (id) => {
    return request.get("nuke.php", {
        params: {
            __lib: "user_option",
            __act: "set",
            raw: 3,
            del: id,
        }
    })
}
//取消关注 合集或子版面
export const unFollow = (id) => {
    return axios({
        url: "/api/nuke.php",
        method: "POST",
        params: {
            __output: 11,
            __lib: "user_option",
            __act: "set",
            raw: 3,
            add: id,
        }
    })
}
export const searchForum = (keyword) => {
    return request8("forum.php", {params: {key: keyword}}).then(res => {
        return res.data
    });
}
//点赞 或 撤赞 value = 1 赞  value = -1 踩
export const topicRecommend = (tid, pid, value = 1) => {
    return request({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: [
            function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                ret = ret.substring(0, ret.lastIndexOf('&'));
                return ret
            }
        ],
        url:"nuke.php",
        method:"post",
        data:{
            __lib: "topic_recommend",
            __act: "add",
            tid,
            pid,
            value,
            raw: 3,
        }
    }).then(res=>{
        return {
            message:res.data[0],
            value:res.data[1],
        }
    })
}