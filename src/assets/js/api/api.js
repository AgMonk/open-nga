import {request} from "@/assets/js/api/nga-request";

export const thread = (fid, page = 1) => {
    return request.get("thread.php", {
        params: {fid, page}
    }).then(res=>{
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
export const getFavForum = () =>{
    return request.get("nuke.php",{
        params:{
            __lib:"forum_favor2",
            __act:"forum_favor",
            action:"get",
        }
    })
}
//添加收藏版面
export const addFavForum = (fid) =>{
    return request.get("nuke.php",{
        params:{
            __lib:"forum_favor2",
            __act:"forum_favor",
            action:"add",
            fid
        }
    })
}
//添加收藏版面
export const delFavForum = (fid) =>{
    return request.get("nuke.php",{
        params:{
            __lib:"forum_favor2",
            __act:"forum_favor",
            action:"del",
            fid
        }
    })
}
