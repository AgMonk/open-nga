// 标签构造函数
function BbsTag(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
}

// 生成标签的正则表达式
function getRegExp(tagName) {
    return new RegExp(`\\[` + tagName + `.+?` + `\\[\/` + tagName + `\\]`)
}

function splitCode(tagName,code) {
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
    let codeObj = splitCode(tagName,code);
    return new BbsTag(tagName, codeObj.props, bbsCodeParser(codeObj.innerCode));
}

function codeParser(tagName, code) {
    let codeObj = splitCode(tagName,code);
    return new BbsTag(tagName, codeObj.props, codeObj.innerCode);
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
    "list": (code) => simpleParser("list", code),
    "table": (code) => simpleParser("table", code),
    "tr": (code) => simpleParser("tr", code),
    "td": (code) => simpleParser("td", code),
    "code": (code) => codeParser("code", code),
    /*todo list 未适配*/
}

// 如果code 的指定位置为 tag的名称
let foundTagParser = (code, startIndex) => {
    let c = code.substring(startIndex);
    let keys = Object.keys(tagParser);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (c.startsWith(`[` + key)) {
            return key;
        }
    }
}


// code解析器 应当返回一个数组 数组成员为 BbsTag
// export const
let
    bbsCodeParser = function (code) {
        let array = [];

        let i = 0;
        while (i < code.length) {
            let char = code[i];
            // 发现疑似tag名称开始
            if (char === '[') {
                //确认是否发现tag
                let tagName = foundTagParser(code, i);
                if (tagName) {
                    //    发现tag
                    if (i > 0) {
                        //    如果 i 此时大于 0 则把 前方文字作为 span解析
                        let spanText = code.substring(0, i)
                        array.push(new BbsTag("span", "", spanText))
                        code = code.substring(i);
                        i = 0;
                    }
                    let regExp = getRegExp(tagName);
                    let match = code.match(regExp);
                    if (match) {
                        let tagCode = match[0]
                        array.push(tagParser[tagName](tagCode));
                        code = code.replace(tagCode, "")
                        i = 0;
                    }
                } else {
                    i++;
                }
            } else {
                i++;
            }
        }
        //检查完毕 如果 i>0 则表示剩余为纯文本 添加一个span
        if (i > 0) {
            array.push(new BbsTag("span", "", code))
        }
        return array;
    }




