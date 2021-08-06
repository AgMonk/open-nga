// 版面主题
// noinspection SpellCheckingInspection

import {ngaRequest} from "@/assets/js/api/nga-request";

export default {
    namespaced: true,
    state: {
        threads: {},
        orderByPostDateDesc: false,
        showToppedTopic:true,
    },
    mutations: {},
    actions: {
        method({dispatch, commit, state}) {

        },
        getThreads({dispatch, commit, state}, params) {
            params.order_by = state.orderByPostDateDesc;

            let cache = state.threads[JSON.stringify(params)];
            let now = new Date().getTime() / 1000;
            if (cache && (now - cache.timestamp) < 3 * 60) {
                return new Promise((resolve) => {
                    resolve(cache.data)
                })
            }
            return dispatch("updateThreads", params)
        },
        updateThreads({dispatch, commit, state}, params) {
            params.order_by = state.orderByPostDateDesc;

            return ngaRequest.thread(params).then(res => {
                state.threads[JSON.stringify(params)] = res;
                return res.data;
            })
        },

    },
    getters: {},
}