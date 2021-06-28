// 尝试识别 pixiv 或 Twitter 图片名称
const pixivRegExp = /\d+?_p\d{1,3}/
const twitterRegExp1 = /\d{19}_\d/
const twitterRegExp2 = /\d{19}/

export const parseImageName = (name) =>{
    let description = "";
    let r1 = pixivRegExp.exec(name);
    let r2 = twitterRegExp1.exec(name)
    let r3 = twitterRegExp2.exec(name)
    if (r1) {
        description = "pix:"+r1[0]
    }else if (r2){
        description = "twi:"+r2[0].split("_")[0]
    }else if (r3){
        description = "twi:"+r3[0]
    }
    return description;
}