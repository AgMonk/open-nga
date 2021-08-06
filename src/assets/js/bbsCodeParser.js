// 输出解析流程
// let debug = true;
import {unEscape} from "@/assets/js/utils";

// let debug = true;
let debug = false;

// 标签构造函数
function BbsTag(type, props, children,raw) {
    this.type = type;
    this.props = props;
    this.children = children;
    this.raw = raw;
}

function debugLog(e) {
    if (debug) {
        console.log(e)
    }
}

// 生成标签的正则表达式
function getTagPairRegExp(tagName) {
    return new RegExp("^\\[" + tagName + "([^[]*?)\\](.*?)\\[\/" + tagName + "\\]")
}

// 关键字在字符串中出现的次数
function countKeyword(keyword, code) {
    return code.split(keyword).length - 1;
}

//从code中截取一个tag 包含的部分 (检查同名嵌套)
function subTagCode(tagName, code) {
    let startCode = "[" + tagName
    let endCode = "[/" + tagName + "]";

    let i = 0;
    let temp;

    let countStart;
    let countEnd;
    while (i < code.length) {
        i = code.indexOf(endCode, i);
        if (i > 0) {
            i += endCode.length;
            temp = code.substring(0, i)
            countStart = countKeyword(startCode, temp);
            countEnd = countKeyword(endCode, temp);
            if (countStart === countEnd) {
                return temp
            }
        } else {
            break
        }
    }
    console.warn("tag数量不匹配: " + temp)
    return temp;
}

function splitCode(tagName, code) {
    let prefix = code.substring(0, code.indexOf("]") + 1);
    let suffix = code.substring(code.lastIndexOf("[/"));
    let innerCode = code.substring(code.indexOf("]") + 1, code.lastIndexOf("[/"));

    let props = prefix
        .replace("[" + tagName, "")
        .replace("]", "")
        .replace("=", "")
        .trim()
    return {prefix, suffix, innerCode, props}
}

// 解析单个tag
function simpleParser(tagName, code) {
    let codeObj = splitCode(tagName, code);
    return new BbsTag(tagName, codeObj.props, bbsCodeParser(codeObj.innerCode),code);
}

function codeParser(tagName, code) {
    let codeObj = splitCode(tagName, code);
    return new BbsTag(tagName, codeObj.props, codeObj.innerCode,code);
}

// tag解析方法
let tagParser = {
    "quote": (code) => simpleParser("quote", code),
    "collapse": (code) => simpleParser("collapse", code),
    "img": (code) => simpleParser("img", code),
    "del": (code) => simpleParser("del", code),
    "b": (code) => simpleParser("b", code),
    "u": (code) => simpleParser("u", code),
    "i": (code) => simpleParser("i", code),
    "h": (code) => simpleParser("h", code),
    "pid": (code) => simpleParser("pid", code),
    "uid": (code) => simpleParser("uid", code),
    "tid": (code) => simpleParser("tid", code),
    "url": (code) => simpleParser("url", code),
    "color": (code) => simpleParser("color", code),
    "ul": (code) => simpleParser("ul", code),
    "li": (code) => simpleParser("li", code),
    "table": (code) => simpleParser("table", code),
    "size": (code) => simpleParser("size", code),
    "tr": (code) => simpleParser("tr", code),
    "td": (code) => simpleParser("td", code),
    "align": (code) => simpleParser("align", code),
    "code": (code) => codeParser("code", code),
}

// 判断 code 的指定位置为 tag的名称
function foundTagParser (code, startIndex) {
    let c = code.substring(startIndex);
    let keys = Object.keys(tagParser).sort((a, b) => b.length - a.length);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (getTagPairRegExp(key).exec(c)) {
            return key;
        }
    }
}

// 带预处理解析
// code解析器 应当返回一个数组 数组成员为 BbsTag
// export const

function bbsCodeParser (code) {
    debugLog("解析tag： " + code)
    let array = [];

    let i = 0;
    while (i < code.length) {
        let char = code[i];
        // 发现疑似tag名称开始
        if (char === '[') {
            //确认是否发现tag
            let tagName = foundTagParser(code, i);
            if (tagName) {
                debugLog(`发现Tag： ` + tagName)
                //    发现tag
                if (i > 0) {
                    //    如果 i 此时大于 0 则把 前方文字作为 span解析
                    let spanText = unEscape(code.substring(0, i))

                    debugLog("添加span： " + spanText)
                    array.push(new BbsTag("span", "", spanText,spanText))
                    code = code.substring(i);
                    i = 0;
                }
                let tagCode = subTagCode(tagName, code);
                debugLog(`截取Tag串: ` + tagCode)
                array.push(tagParser[tagName](tagCode));
                code = code.replace(tagCode, "")
                i = 0;
            } else {
                i++;
            }
        } else {
            i++;
        }
    }
    //检查完毕 如果 i>0 则表示剩余为纯文本 添加一个span
    if (i > 0) {
        let spanText = unEscape(code)

        debugLog("添加span： " + spanText)
        array.push(new BbsTag("span", "", spanText,spanText))
    }
    return array;
}

//    删除指定标签附近的多余换行符 <br/>
function delBrTag(code, tagName) {
    return code
        .replace(new RegExp("<br\/>\\[" + tagName + "]", "g"), "[" + tagName + "]")
        .replace(new RegExp("<br\/>\\[\/" + tagName + "]", "g"), "[/" + tagName + "]")
}

export const parseBbsCode = (code) => {
    if (!code) {
        return [];
    }

    // 删除多余换行符
    code = delBrTag(code, "h")
    code = delBrTag(code, "list")
    code = delBrTag(code, "quote")

    //表格标签标准化
    code = code
        .replace(/<br\/>\[\*]/g, "[/li][li]")
        .replace(/\[\*]/g, "[/li][li]")
        .replace(/\[list]\[\/li]/g, "[ul]")
        .replace(/\[\/list]/g, "[/li][/ul]")


    let replyCodeRegExp = /\[b]Reply to \[pid=.+?\[\/b]/g
    let res;
    while (res = replyCodeRegExp.exec(code)){
        code = code.replace(res[0],"[quote]"+res[0]+"[/quote]")
    }

    // console.log("解析正文：" + code)
    let obj = bbsCodeParser(code);
    debugLog(obj)
    return obj
}




