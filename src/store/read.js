// 版面主题
// noinspection SpellCheckingInspection,JSUnresolvedVariable

import {ngaRequest, obj2Array} from "@/assets/js/api/nga-request";

export default {
    namespaced: true,
    state: {
        details: {},
    },
    mutations: {
        handleReplies(state, {reply,data}){
            // 声望等级
            let getLevelName = (reputation) => {
                let levelString = data.__F.custom_level;
                if (!levelString) {
                    return undefined
                }
                while (levelString.includes("r:")) {
                    levelString = levelString.replace("r:", "\"r\":")
                }
                while (levelString.includes("n:")) {
                    levelString = levelString.replace("n:", "\"n\":")
                }
                let reputationsLevels = JSON.parse(levelString)
                for (let i = reputationsLevels.length - 1; i >= 0; i--) {
                    let v = reputationsLevels[i]
                    if (reputation >= v.r) {
                        return v.n;
                    }
                }
            }
            // 发布时间格式化
            reply.postdate = reply.postdatetimestamp ?
                new Date(reply.postdatetimestamp * 1000).format("yyyy-MM-dd hh:mm:ss") : reply.postdate

            if (reply.comment){
                reply.comment = obj2Array(reply.comment)
            }

            //  复制声望数据
            let uid = reply.authorid;
            let info = {uid}
            reply.userInfo = info
            let reputations = data.__U.__REPUTATIONS;
            Object.keys(reputations).forEach((key => {
                let groups = reputations[key];
                if (groups[uid]) {
                    info.reputation = {}
                    info.reputation.value = groups[uid];
                    info.reputation.name = getLevelName(groups[uid]);
                }
            }))

            // 匿名用户 uuid 化 填充用户名
            let username = data.__U[reply.authorid].username;
            info.username = username;
            if (reply.authorid < 0) {
                reply.authorid = username;
                info.uid = username;
            }

            // 修改记录
            if (reply.alterinfo && reply.alterinfo.length > 0) {
                reply.alterinfo.split("]")
                    .filter(s => s !== '')
                    .map(s => s.replace("[", ""))
                    .map(s => {
                        return {
                            type: s[0],
                            data: s.substring(1).split(" ")
                        }
                    })
                    .forEach(log => {
                        if (log.type === "E") {
                            // 编辑记录
                            reply.lastEdit = new Date(log.data[0] * 1000).format("yyyy-MM-dd hh:mm:ss")
                        }
                        if (log.type === "L") {
                            // 禁言
                            reply.operationLog = reply.operationLog ? reply.operationLog : [];
                            reply.operationLog.push({
                                //L6 0 0 300 20 引战/转进/AOE
                                type: "禁言",
                                days: log.data[0],
                                fid: log.data[1],
                                reputation: log.data[3] * (-1),
                                rvrc: log.data[4] / 10 * (-1),
                                reason: log.data[5],
                            })
                        }
                        if (log.type === "U") {
                            // 取消操作
                            reply.operationLog = reply.operationLog ? reply.operationLog : [];
                            reply.operationLog.push({
                                // [U0 0 0 UB105]
                                type: "取消操作",
                                days: log.data[0],
                                reputation: log.data[1],
                                rvrc: log.data[2] / 10,
                            })
                        }
                    })
            }
        }
    },
    actions: {
        method({dispatch, commit, state}) {

        },
        getDetail({dispatch, commit, state}, {tid, page, authorid, pid}) {
            let params = pid ? {pid} : {tid, page, authorid}
            let t = state.details[JSON.stringify(params)];
            let now = new Date().getTime() / 1000;
            if (t && (now - t.timestamp) < 3 * 60) {
                // 短时间使用缓存数据
                return new Promise((resolve) => {
                    resolve(t.data)
                })
            }
            return dispatch("updateDetail", params)
        },
        updateDetail({dispatch, commit, state}, params) {
            return ngaRequest.read(params).then(async res => {
                state.details[JSON.stringify(params)] = res;
                let data = res.data;
                // Object.keys(data.__R).forEach(key => {
                // let reply = data.__R[key];
                for (let i = 0; i < data.__R.length; i++) {
                    const reply = data.__R[i];

                    commit("handleReplies", {reply, data})


                    let commentToId = reply.comment_to_id;
                    let pid = reply.pid;
                    if (!reply.content && commentToId) {
                        // 贴条回复 补充正文
                        if (commentToId > 0) {
                            await dispatch("getDetail", {pid: commentToId}).then(response => {
                                let target = response.__R[0].comment.filter(r => r.pid === pid)[0];
                                reply.content = target.content;
                                reply.score = target.score;
                            })
                        }else{
                            await dispatch("getDetail", {tid: data.__T.tid,page:1}).then(response => {
                                let target = response.__R[0].comment.filter(r => r.pid === pid)[0];
                                reply.content = target.content;
                                reply.score = target.score;
                            })
                        }
                    }
                }

                return data;
            })
        },

    },
    getters: {},
}