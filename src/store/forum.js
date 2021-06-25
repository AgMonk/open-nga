// 收藏版面
import {addFavForum, delFavForum, getFavForum} from "@/assets/js/api/api";
import {ElMessage} from "element-plus";

export default {
    namespaced: true,
    state: {
        forums: [],
        timestamp:0,
    },
    mutations: {},
    actions: {
        method({dispatch, commit, state}) {

        },
        delFavForum({dispatch, commit, state}, fid) {
            delFavForum(fid).then(res => {
                if (res.data) {
                    ElMessage.success(res.data[0])
                    dispatch("getFavForum")
                } else if (res.error) {
                    ElMessage.error(res.error[0])
                }
            })
        },
        refreshFavForum({state}) {
            return getFavForum().then(res => {
                state.forums = res.data;
                state.timestamp = res.timestamp;
                return res.data;
            })
        },
        getFavForum({dispatch,state}) {
            let now = new Date().getTime()/1000;
            let t = state.timestamp
            if (t && now - t < 3 * 60 * 1000) {
                return new Promise((resolve) => {
                    resolve(state.forums)
                })
            }
            return dispatch("refreshFavForum")
        },
        addFavForum({dispatch, commit, state}, fid) {
            addFavForum(fid).then(res => {
                if (res.data) {
                    ElMessage.success(res.data[0])
                    dispatch("getFavForum")
                } else if (res.error) {
                    ElMessage.error(res.error[0])
                }
            })
        },

    },
    getters: {},
}