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
                state.details[JSON.stringify({tid, page})] = res;
                return res;
            })
        },

    },
    getters: {},
}