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
            if (info.regdate) {
                info.regDate = new Date(info.regdate * 1000).format("yyyy-MM-dd hh:mm:ss");
            }

            // 总赞数
            if (info.more_info) {
                info.totalApproval = parseInt(info.more_info[0].data);
            }
            if (info.username && info.username.toString().startsWith("UID")) {
                delete info.username;
            }
            if (info.money) {
                if (info.money === 0) {
                    delete info.money;
                } else {
                    // 货币
                    let d = info.money;
                    let copper = d % 100;
                    d = (d - copper) / 100;
                    let silver = d % 100;
                    d = (d - silver) / 100;
                    let gold = d;
                    info.moneyString = gold + "金" + silver + "银" + copper + "铜";
                }
            }
            if (info.posts === 0) {
                delete info.posts;
            }

            if (!state.users[info.uid]) {
                state.users[info.uid] = {}
            }
            Object.keys(info).forEach(key => {
                // console.log("更新 uid = "+info.uid+" 字段 "+key+" = "+ info[key])
                if (info[key]) {
                    state.users[info.uid][key] = info[key];
                }
            })
            // console.log(state.users[info.uid])
            // let userInfo = Object.assign({}, state.users[info.uid], info);
            // state.users[info.uid] = userInfo;

            // console.log(state.users[info.uid])
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
                putCache("account " + res.username, cookie)
                return res;
            })
        },
        userInfo({dispatch, commit, state}, uid) {
            if (state.users[uid] && state.users[uid].totalApproval) {
                return new Promise(resolve => {
                    resolve(state.users[uid])
                })
            }
            if (isNaN(uid)){
                let u = {
                    uid,
                    username:uid,
                }
                commit("saveUser",u)
                return new Promise(resolve => {
                    resolve(u)
                })
            }
            return userInfo(uid).then(res => {
                let info = res.data[0];
                delete  info.rvrc
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