// 版面主题
// noinspection SpellCheckingInspection

import {thread} from "@/assets/js/api/api";

export default {
    namespaced: true,
    state: {
        threads: {},
    },
    mutations: {
    },
    actions: {
        method({dispatch, commit, state}) {

        },
        getThreads({dispatch, commit, state}, params) {
            let t = state.threads[JSON.stringify(params)];
            if (t) {
                return new Promise((resolve) => {resolve(t)})
            }
            return dispatch("updateThreads",params)
        },
        updateThreads({dispatch, commit, state}, params) {
            return thread(params).then(res=>{
                state.threads[JSON.stringify(params)] = res;
                return res;
            })
        },

    },
    getters: {},
}