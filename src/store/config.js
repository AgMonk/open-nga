// 界面配置
import {getCache, putCache} from "@/assets/js/storageUtils";
import {copyObj} from "@/assets/js/utils";

export default {
    namespaced: true,
    state: {
        configKey:"ui-config",
        config:{},
        options:{
            uiColor:{
                yellow:"黄色",
                black:"黑色",
                green:"绿色",
            },
        },
        defaultConfig:{
            uiColor:"green",
        }
    },
    mutations: {
        setConfig(state,{key,value}) {
            state.config[key] = value;
            this.save(state)
        },
        save(state){
            putCache(state.configKey,state.config)
        },
        load(state){
            let cache = getCache(state.configKey);
            state.config = cache?cache:copyObj(state.defaultConfig);
            console.log(state.config)
        },

    },
    actions: {
        method({dispatch, commit, state}) {

        },
    },
    getters: {},
}