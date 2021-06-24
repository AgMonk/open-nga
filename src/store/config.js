// 界面配置
import {getCache, putCache} from "@/assets/js/storageUtils";
import {copyObj} from "@/assets/js/utils";

export default {
    namespaced: true,
    state: {
        configKey:"ui-config",
        config:{},
        options:{
            uiColor:[
                {label:"黑色",value:"black"},
                {label:"黄色",value:"yellow"},
                {label:"绿色",value:"green"},
            ]
        },
        defaultConfig:{
            uiColor:"green",
            autoRefresh:false,
        }
    },
    mutations: {
        save(state){
            putCache(state.configKey,state.config)
        },
        load(state){
            let cache = getCache(state.configKey);
            state.config = cache?cache:copyObj(state.defaultConfig);
        },
        setConfig(state,{key,value}) {
            state.config[key] = value;
            console.log(state.config)
            putCache(state.configKey,state.config)
        },

    },
    actions: {
        method({dispatch, commit, state}) {

        },
    },
    getters: {},
}