// 尝试识别 pixiv 或 Twitter 图片名称
const pixivRegExp = /\d+?_p\d{1,3}/
const twitterRegExp1 = /\d{19}_\d/
const twitterRegExp2 = /\d{19}/

export const parseImageName = (name) =>{
    let description;
    let url;
    let pixivPrefix = "pixiv.net/artworks/"
    let twitterPrefix = "twitter.com/i/status/"
    let r1 = pixivRegExp.exec(name);
    let r2 = twitterRegExp1.exec(name)
    let r3 = twitterRegExp2.exec(name)
    if (r1) {
        let pixivId = r1[0].split("_p")[0];
        description = "pix:"+ pixivId
        url = pixivPrefix + pixivId
    }else if (r2){
        let twiId = r2[0].split("_")[0];
        description = "twi:"+twiId
        url = twitterPrefix+ twiId
    }else if (r3){
        description = "twi:"+r3[0]
        url = twitterPrefix+ r3[0]
    }
    return description?{description,url}:undefined;
}