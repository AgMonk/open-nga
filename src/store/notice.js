// 提醒
import {getNotice} from "@/assets/js/api/api";

export default {
    namespaced: true,
    state: {
        approbation: [],
        replies: [],
        pm: [],
        gotNew:{
            hasNew:false,
            approbation:false,
            replies:false,
            pm:false,
        }
    },
    mutations: {},
    actions: {
        method({dispatch, commit, state}) {

        },
        getNotice({dispatch, commit, state}) {
            getNotice().then(res => {
                //检查是否有新消息

                if (state.approbation.length !== res.approbation.length) {
                    state.gotNew.approbation = true;
                } else if (state.approbation[0].timestamp !== res.approbation[0].timestamp) {
                    state.gotNew.approbation = true;
                }

                if (state.pm.length !== res.pm.length) {
                    state.gotNew.pm = true;
                } else if (state.pm[0].timestamp !== res.pm[0].timestamp) {
                    state.gotNew.pm = true;
                }

                if (state.replies.length !== res.replies.length) {
                    state.gotNew.replies = true;
                } else if (state.replies[0].timestamp !== res.replies[0].timestamp) {
                    state.gotNew.replies = true;
                }

                state.approbation = res.approbation
                state.pm = res.pm
                state.replies = res.replies

                console.log(res)
            })
        },

    },
    getters: {},
}