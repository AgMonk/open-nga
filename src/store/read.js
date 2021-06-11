// 版面主题
// noinspection SpellCheckingInspection,JSUnresolvedVariable

import {read} from "@/assets/js/api/api";

export default {
    namespaced: true,
    state: {
        details: {},
    },
    mutations: {},
    actions: {
        method({dispatch, commit, state}) {

        },
        getDetail({dispatch, commit, state}, {tid, page,authorid, pid}) {
            let params = pid ? {pid}:{tid,page,authorid}
            let t = state.details[JSON.stringify(params)];
            if (t) {
                return new Promise((resolve) => {
                    resolve(t)
                })
            }
            return dispatch("updateDetail", params)
        },
        updateDetail({dispatch, commit, state},{tid, page,authorid, pid}) {
            let params = pid ? {pid}:{tid,page,authorid}
            return read(params).then(res => {

                // 声望等级
                let levelString = res.__F.custom_level;
                while (levelString.includes("r:")) {
                    levelString = levelString.replace("r:", "\"r\":")
                }
                while (levelString.includes("n:")) {
                    levelString = levelString.replace("n:", "\"n\":")
                }
                let reputationsLevels = JSON.parse(levelString)
                let getLevelName = (reputation) => {
                    for (let i = reputationsLevels.length - 1; i >= 0; i--) {
                        let v = reputationsLevels[i]
                        if (reputation >= v.r) {
                            return v.n;
                        }
                    }
                }
                Object.keys(res.__R).forEach(key => {
                    let reply = res.__R[key];
                    // 发布时间格式化
                    reply.postdate = new Date(reply.postdatetimestamp * 1000).format("yyyy-MM-dd hh:mm:ss")
                    //  复制声望数据
                    let uid = reply.authorid;
                    let info = {uid}
                    reply.userInfo = info
                    let reputations = res.__U.__REPUTATIONS;
                    Object.keys(reputations).forEach((key => {
                        let groups = reputations[key];
                        if (groups[uid]) {
                            info.reputation = {}
                            info.reputation.value = groups[uid];
                            info.reputation.name = getLevelName(groups[uid]);
                        }
                    }))

                    // 匿名用户 uuid 化 填充用户名
                    let username = res.__U[reply.authorid].username;
                    info.username = username;
                    if (reply.authorid < 0) {
                        reply.authorid = username;
                        info.uid = username;
                    }

                    // 修改记录
                    if (reply.alterinfo.length > 0) {
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
                                        reputation: log.data[3],
                                        rvrc: log.data[4] / 10,
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

                })


                state.details[JSON.stringify(params)] = res;
                return res;
            })
        },

    },
    getters: {},
}