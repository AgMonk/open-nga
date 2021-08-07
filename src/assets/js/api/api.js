// noinspection SpellCheckingInspection,JSUnfilteredForInLoop

import {ElMessage} from "element-plus";
import {ngaRequest, obj2Array} from "@/assets/js/api/nga-request";


export const delAttach = (tid,pid,aid) =>ngaRequest.nuke({
    func:"delattach",
    tid,pid,aid,
    raw:3,
})

export const userInfo = (uid) => ngaRequest.nuke({
    __lib: "ucp",
    __act: "get",
    uid
})

export const report = (tid,pid,info) =>ngaRequest.nuke({
    tid,pid,info,raw:3,
    __lib:"log_post",
    __act:"report",
})


//查询收藏版面列表

export const getFavForum = () => ngaRequest.nuke({
    __lib: "forum_favor2",
    __act: "forum_favor",
    action: "get",
}).then(res => ({
    data: obj2Array(res.data[0]),
    timestamp: res.time
}))
//添加收藏版面

export const addFavForum = (fid) => ngaRequest.nuke({
    __lib: "forum_favor2",
    __act: "forum_favor",
    action: "add",
    fid
})
//添加收藏版面

export const delFavForum = (fid) => ngaRequest.nuke({
    __lib: "forum_favor2",
    __act: "forum_favor",
    action: "del",
    fid
})

//关注 合集或子版面

export const follow = (id, fid) => ngaRequest.nuke({
    __lib: "user_option",
    __act: "set",
    raw: 3,
    type: 1,
    info: "add_to_block_tids",
    del: id,
    fid,
})
//取消关注 合集或子版面

export const unFollow = (id, fid) => ngaRequest.nuke({
    __lib: "user_option",
    __act: "set",
    raw: 3,
    type: 1,
    info: "add_to_block_tids",
    add: id,
    fid,
})
//点赞 或 撤赞 value = 1 赞  value = -1 踩

export const topicRecommend = (tid, pid, value = 1) => ngaRequest.nuke({
        __lib: "topic_recommend",
        __act: "add",
        tid,
        pid,
        value,
        raw: 3,
    }
).then(res => ({
    message: res.data[0],
    value: res.data[1],
}))
//不再提示 赞踩

export const noHint = (tid, pid) => ngaRequest.nuke({
    func: "noti_tag",
    no_hint: 1,
    raw: 3,
    tid, pid,
}).then(res => res.data["0"])
//清空提醒

export const clearNotice = () => ngaRequest.nuke({
    __lib: "noti",
    __act: "del",
    raw: 3,
}).then(res => ElMessage.success(res.data["0"]))

export const getNotice = () => ngaRequest.nuke({
    __lib: "noti",
    raw: 3,
    __act: "get_all",
    time_limit: 1,
}).then(res => {
    // 回复提醒
    // console.log(res.data)


    let replies = res.data["0"]["0"];
    replies = !replies ? undefined : replies.map(reply => {
        if (reply["0"] === 1 || reply["0"] === 2) {
           return  {
               type:reply["0"] === 1?`对主题`:`对回复`,
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
        }
        if (reply["0"] === 15 ) {
            return  {
                type:`送礼物`,
                authorId: reply["1"],
                authorName: reply["2"],
                repliedId: reply["3"],
                threadSubject: reply["5"],
                tid: reply["6"],
                repliedPid: reply["7"],
                timestamp: reply["9"],
                page: reply["10"],
                timeString: new Date(reply["9"] * 1000).format("yyyy-MM-dd hh:mm:ss")
            }
        }

    }).reverse();

    // 短消息提醒
    let pm = res.data["0"]["1"];
    pm = !pm ? undefined : pm.map(r => ({
        authorId: r["1"],
        authorName: r["2"],
        mid: r["6"],
        timestamp: r["9"],
        timeString: new Date(r["9"] * 1000).format("yyyy-MM-dd hh:mm:ss")
    })).reverse();
    // 赞踩变化
    let approbation = res.data["0"]["2"];
    approbation = !approbation ? undefined : approbation.map(r => ({
        uid: r["3"],
        threadSubject: r["5"],
        tid: r["6"],
        pid: r["7"],
        timestamp: r["9"],
        timeString: new Date(r["9"] * 1000).format("yyyy-MM-dd hh:mm:ss")
    })).reverse();

    return {replies, approbation, pm}
})



export const searchForum = (key) => ngaRequest.forum(key)
