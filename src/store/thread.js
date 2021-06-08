// 版面主题
export default {
    namespaced: true,
    state: {
        fid: 0,
        page: 1,
        threads: {},
    },
    mutations: {
        setForum(state, {fid, page}) {
            state.fid = fid
            state.page = page
            console.log(state)
            console.log(state)
        },
    },
    actions: {
        method({dispatch, commit, state}) {

        },
    },
    getters: {},
}