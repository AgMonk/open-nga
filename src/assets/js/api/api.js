import {request} from "@/assets/js/api/nga-request";

export const thread = (fid) => {
    return request.get("thread.php", {
        params: {fid}
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