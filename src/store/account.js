// 账号
import {getCookie, getCookieMap, setCookies} from "@/assets/js/cookieUtils";
import {userInfo} from "@/assets/js/api/api";
import {ElMessage} from "element-plus";
import {putCache} from "@/assets/js/storageUtils";

export default {
    namespaced: true,
    state: {
        userInfo: undefined,
        users: {},
    },
    mutations: {
        saveUser(state, info) {
            // 注册日期
            info.regDate = new Date(info.regdate * 1000).format("yyyy-MM-dd hh:mm:ss");

            // 货币
            let d = info.money;
            let copper = d % 100;
            d = (d - copper) / 100;
            let silver = d % 100;
            d = (d - silver) / 100;
            let gold = d;
            info.moneyString = gold + "金" + silver + "银" + copper + "铜";

            // 总赞数
            if (info.more_info) {
                info.totalApproval = parseInt(info.more_info[0].data);
            }
            if (info.username.startsWith("UID")) {
                delete info.username;
            }
            if (info.money===0) {
                delete info.money;
            }
            if (info.posts===0) {
                delete info.posts;
            }



            state.users[info.uid] = Object.assign({}, state.users[info.uid], info);
        },
    },
    actions: {
        method({dispatch, commit, state}) {

        },
        loginWithCookie({dispatch, commit, state}, cookie) {
            setCookies(cookie)
            console.log(getCookieMap());
            return dispatch("getLoginStatus").then(res => {
                ElMessage.success("[" + res.username + "] 登陆成功")
                putCache("account "+res.username,cookie)
                return res;
            })
        },
        userInfo({dispatch, commit, state}, uid) {
            return userInfo(uid).then(res => {
                let info = res.data[0];
                commit("saveUser", info)
                return info
            })
        },
        //检查登陆状态
        getLoginStatus({dispatch, commit, state}) {
            let uid = getCookie("ngaPassportUid");
            return dispatch("userInfo", uid).then(res => {
                state.userInfo = res;
                return res
            })
        }
    },
    getters: {},
}