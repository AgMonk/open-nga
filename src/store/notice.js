// 提醒
import {clearNotice, getNotice} from "@/assets/js/api/api";

export default {
    namespaced: true,
    state: {
        approbation: [],
        replies: [],
        pm: [],
        gotNew: {
            hasNew: false,
            approbation: false,
            replies: false,
            pm: false,
        }
    },
    mutations: {},
    actions: {
        method({dispatch, commit, state}) {

        },
        clearNotice({state}) {
                if (confirm("清除所有提示信息?")){
                    clearNotice().then(() =>{
                        state.approbation=[];
                        state.replies=[];
                        state.pm=[];
                    })
                }
        },

        getNotice({state}) {
            getNotice().then(res => {
                //检查是否有新消息
                let checkNew = (key)=>{
                    if (res[key]){
                        if (state[key].length !== res[key].length) {
                            state.gotNew[key] = true;
                        }else if (state[key][0].timestamp!==res[key][0].timestamp) {
                            state.gotNew[key] = true;
                        }
                        state[key] = res[key]
                    }
                }

                checkNew("approbation")
                checkNew("pm")
                checkNew("replies")


                console.log(res)
            })
        },

    },
    getters: {},
}