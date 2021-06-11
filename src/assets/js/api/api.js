// noinspection SpellCheckingInspection

import {request, request8} from "@/assets/js/api/nga-request";
import axios from "axios";

export const thread = ({fid, page = 1, stid}) => {
    let params = stid ? {page, stid} : {fid, page};
    return request8.get("thread.php", {
        params,
    }).then(res => {
        return res.data
    })
}

export const read = ({tid, page = 1,authorid, pid}) =>{
    let params = pid ? {pid}:{tid,page,authorid}
    return request8.get("read.php", {
        params
    }).then(res => {
        return res.data
    })
}

export const userInfo = (uid) => {
    return request.get("nuke.php", {
        params: {
            __lib: "ucp",
            __act: "get",
            uid
        }
    })
}
//查询收藏版面列表
export const getFavForum = () => {
    return request.get("nuke.php", {
        params: {
            __lib: "forum_favor2",
            __act: "forum_favor",
            action: "get",
        }
    })
}
//添加收藏版面
export const addFavForum = (fid) => {
    return request.get("nuke.php", {
        params: {
            __lib: "forum_favor2",
            __act: "forum_favor",
            action: "add",
            fid
        }
    })
}
//添加收藏版面
export const delFavForum = (fid) => {
    return request.get("nuke.php", {
        params: {
            __lib: "forum_favor2",
            __act: "forum_favor",
            action: "del",
            fid
        }
    })
}

//关注 合集或子版面
export const follow = (id) => {
    return request.get("nuke.php", {
        params: {
            __lib: "user_option",
            __act: "set",
            raw: 3,
            del: id,
        }
    })
}
//取消关注 合集或子版面
export const unFollow = (id) => {
    return axios({
        url:"/api/nuke.php",
        method: "POST",
        params: {
            __output:11,
            __lib: "user_option",
            __act: "set",
            raw: 3,
            add: id,
        }
    })
}
export const searchForum = (keyword) => {
    return request8("forum.php", {params: {key: keyword}}).then(res => {
        return res.data
    });
}