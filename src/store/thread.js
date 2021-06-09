// 版面主题
// noinspection SpellCheckingInspection

import {thread} from "@/assets/js/api/api";

export default {
    namespaced: true,
    state: {
        threads: {},
    },
    mutations: {
        setForum(state, {fid, page,stid}) {
            state.fid = fid
            state.page = page
            state.stid = stid
        },
    },
    actions: {
        method({dispatch, commit, state}) {

        },
        getThreads({dispatch, commit, state}, {fid, page,stid}) {
            let params = stid?{page,stid}:{fid, page};
            let t = state.threads[JSON.stringify(params)];
            if (t) {
                return new Promise((resolve) => {resolve(t)})
            }
            return dispatch("updateThreads",params)
        },
        updateThreads({dispatch, commit, state}, {fid, page,stid}) {
            let params = stid?{page,stid}:{fid, page};
            return thread(params).then(res=>{
                state.threads[JSON.stringify(params)] = res;
                return res;
            })
        },

    },
    getters: {},
}