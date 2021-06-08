// 收藏版面
import {addFavForum, delFavForum, getFavForum} from "@/assets/js/api/api";
import {ElMessage} from "element-plus";

export default {
    namespaced: true,
    state: {
        forums: [],
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
        getFavForum({state}) {
            return getFavForum().then(res => {
                state.forums = res.data[0];
                return res.data[0];
            })
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