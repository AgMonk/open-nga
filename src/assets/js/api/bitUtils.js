// bit数据解析
//主题(回复)类型bit
// https://bbs.nga.cn/read.php?tid=6406100&authorid=58

export const parseThreadTypeBit = (num) => {
    if (!num || num === 0) {
        return {};
    }
    let binaryString = num.toString(2).split('').reverse().join('');
    const [isComment,hidden,hasComment,,extraUserInfo,,noHint,freeEdit,selfReply,,locked,,hasAutoTranslate,hasUpload] = binaryString
    const notVerified = binaryString[26];
    const obj = {
        hasUpload,hasAutoTranslate,locked,selfReply,freeEdit,noHint,extraUserInfo,hasComment,hidden,isComment,notVerified
    }
    console.log(binaryString)
    Object.keys(obj).forEach(key => {
        obj[key] = obj[key]==="1"
    })
    return obj;
}