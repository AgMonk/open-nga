// 版面主题
import {thread} from "@/assets/js/api/api";

export default {
    namespaced: true,
    state: {
        threads: {},
    },
    mutations: {
        setForum(state, {fid, page}) {
            state.fid = fid
            state.page = page
        },
    },
    actions: {
        method({dispatch, commit, state}) {

        },
        getThreads({dispatch, commit, state}, {fid, page}) {
            let t = state.threads[fid+" "+page];
            if (t) {
                return new Promise((resolve) => {resolve(t)})
            }
            return dispatch("updateThreads",{fid,page})
        },
        updateThreads({dispatch, commit, state}, {fid, page}) {
            return thread(fid, page).then(res=>{
                state.threads[fid+" "+page] = res;
                return res;
            })
        },

    },
    getters: {},
}