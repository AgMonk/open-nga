//版面搜搜

import axios from "axios";

// noinspection SpellCheckingInspection
let request = axios.create({
    baseURL: "/api/",
    timeout: 3000,
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Cache-Control": "max-age=0",
    },
    params: {
        __output: 8,
        __inchst: "UTF8",
    },
    responseType: 'blob',
    transformResponse: [function (data) {
        let reader = new FileReader();
        reader.readAsText(data, 'GBK');
        // reader.onload = function (e) {
        //     console.log(reader.result);
        // }
        return new Promise(resolve => {
            reader.onload = function () {
                // console.log(reader.result);
                let result = reader.result;
                while (result.includes("	")) {
                    result = result.replace("	", "")
                }
                // noinspection JSCheckFunctionSignatures
                resolve(JSON.parse(result))
            }
        });
    }]


})

export const searchForum = (keyword) => {
    return request("forum.php", {params: {key: keyword}}).then(res => {
        return res.data
    });
}

