// bit数据解析

export const parseThreadTypeBit = (num) => {
    let binaryString = num.toString(2).split('').reverse().join('');
    const [isComment,hidden,hasComment,,extraUserInfo,,noHint,freeEdit,selfReply,,locked,,hasAutoTranslate,hasUpload] = binaryString
    const obj = {
        hasUpload,hasAutoTranslate,locked,selfReply,freeEdit,noHint,extraUserInfo,hasComment,hidden,isComment
    }
    console.log(binaryString)
    Object.keys(obj).forEach(key => {
        obj[key] = obj[key]==="1"
    })
    return obj;
}