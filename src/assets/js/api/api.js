// noinspection SpellCheckingInspection

import {request, request8} from "@/assets/js/api/nga-request";
import axios from "axios";
import {ElMessage} from "element-plus";

export const transformRequest = [
    function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'));
        return ret
    }
]
export const formDataHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded'
};


export const thread = ({stid, fid, page, authorid, searchpost}) => {
    let params = stid ? {stid, page}
        : (searchpost ? {fid, page, authorid, searchpost}
                : ({fid, page})
        )
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
        // 请求时间
        res.data.time = res.time
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
        headers: formDataHeaders,
        transformRequest,
        url: "nuke.php",
        method: "post",
        data: {
            __lib: "topic_recommend",
            __act: "add",
            tid,
            pid,
            value,
            raw: 3,
        }
    }).then(res => {
        return {
            message: res.data[0],
            value: res.data[1],
        }
    })
}


export const getNotice = () => {
    return request8("nuke.php", {
        headers: formDataHeaders,
        method: "post",
        transformRequest,
        params: {
            __lib: "noti",
            raw: 3,
        },
        data: {
            __act: "get_all",
            time_limit: 1,
        }
    }).then(res => {
        // 回复提醒
        let replies = res.data["0"]["0"];
        replies = replies.map(reply => {
            return {
                authorId: reply["1"],
                authorName: reply["2"],
                repliedId: reply["3"],
                repliedName: reply["4"],
                threadSubject: reply["5"],
                tid: reply["6"],
                replyPid: reply["7"],
                repliedPid: reply["8"],
                timestamp: reply["9"],
                page: reply["10"],
                timeString: new Date(reply["9"] * 1000).format("yyyy-MM-dd hh:mm:ss")
            }
        }).reverse();

        // 赞踩变化
        let approbation = res.data["0"]["2"];
        approbation = approbation.map(r => {
            return {
                uid: r["3"],
                threadSubject: r["5"],
                tid: r["6"],
                pid: r["7"],
                timestamp: r["9"],
                timeString: new Date(r["9"] * 1000).format("yyyy-MM-dd hh:mm:ss")
            }
        }).reverse();

        return {replies, approbation}
    })
}
