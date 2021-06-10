// 版面主题
// noinspection SpellCheckingInspection

import {read} from "@/assets/js/api/api";

export default {
    namespaced: true,
    state: {
        details: {},
    },
    mutations: {
    },
    actions: {
        method({dispatch, commit, state}) {

        },
        getDetail({dispatch, commit, state}, {tid, page}) {
            let t = state.details[JSON.stringify({tid, page})];
            if (t) {
                return new Promise((resolve) => {resolve(t)})
            }
            return dispatch("updateDetail",{tid, page})
        },
        updateDetail({dispatch, commit, state}, {tid, page}) {
            return read(tid, page).then(res=>{

                // 声望等级
                let levelString = res.__F.custom_level;
                while (levelString.includes("r:")){
                    levelString=levelString.replace("r:","\"r\":")
                }
                while (levelString.includes("n:")){
                    levelString=levelString.replace("n:","\"n\":")
                }
                let reputationsLevels = JSON.parse(levelString)
                let getLevelName = (reputation) =>{
                    for (let i = reputationsLevels.length-1; i >=0; i--) {
                        let v = reputationsLevels[i]
                        if (reputation >= v.r) {
                            return v.n;
                        }
                    }
                }
                console.log(reputationsLevels)

                //  复制声望数据
                res.__R.forEach(reply => {
                    let uid = reply.authorid;
                    let reputations = res.__U.__REPUTATIONS;
                    Object.keys(reputations).forEach((key => {
                        let groups = reputations[key];
                        if (groups[uid]) {
                            reply.reputation = groups[uid];
                            reply.reputationName = getLevelName(groups[uid]);
                        }
                    }))
                })

                state.details[JSON.stringify({tid, page})] = res;
                return res;
            })
        },

    },
    getters: {},
}