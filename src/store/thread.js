// 版面主题
export default {
    namespaced: true,
    state: {
        fid: undefined,
        page: undefined,
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
    },
    getters: {},
}