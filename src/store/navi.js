// 导航栏

export default {
    namespaced: true,
    state: {
        show: true,
        navigators: {
            "thread": {path: "/thread", title: "主题列表"},
            "read": {path: "/read", title: "主题详情"},
            "account": {path: "/account", title: "用户中心"},
            "my": {
                path: "", title: `我的`, children: [
                    {path: "/forum", title: "收藏版面"},
                    {path: "/thread/favor/1", title: "收藏主题"},
                    {path: "/config", title: "配置"},
                ]
            }
        },
        params: {
            "thread": [],
            "account": [],
            "read": [],
        }
    },
    mutations: {
        setShow(state) {
            state.show = !state.show;
        },
        updatePath(state) {
            let keys = Object.keys(state.navigators);
            keys.forEach(key => {
                let navi = state.navigators[key]
                if (navi.children) {
                    return;
                }
                let param = state.params[key] ? state.params[key] : [];
                let a = [key, ...param]
                navi.path = "/" + a.join("/");
            })
        },
        setParams(state, {key, params}) {
            state.params[key] = params;
        },
    },
    actions: {
        method({dispatch, commit, state}) {

        },
    },
    getters: {},
}