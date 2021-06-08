// 导航栏
import {getCookie} from "@/assets/js/cookieUtils";

export default {
    namespaced: true,
    state: {
        show: true,
        navigators: {
            "forum": {path: "/forum", title: "收藏版面"},
            "thread": {path: "/thread", title: "主题列表"},
            "account": {path: "/account/"+getCookie("ngaPassportUid"), title: "用户中心"},
        },
        params: {
            "thread": [],
            "account": [],
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
                let param = state.params[key]?state.params[key]:[];
                let a = [key, ...param]
                navi.path = "/" + a.join("/");
            })
        },
        setParams(state, {key,params}) {
            state.params[key] = params;
        },
    },
    actions: {
        method({dispatch, commit, state}) {

        },
    },
    getters: {},
}