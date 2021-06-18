//  根据解析器的结果 渲染标签
// noinspection JSXNamespaceValidation


export const renderMap = {
    "quote": (children) => <el-card className="box-card">{bbsCodeRender(children)}</el-card>,
    "ul": (children) => <ul>{bbsCodeRender(children)}</ul>,
    "li": (children) => <li>{bbsCodeRender(children)}</li>,
    "h": (children) => <h3>{bbsCodeRender(children)}</h3>,
    "span": (children) => <span>{children}</span>,
}


export const bbsCodeRender = function (tags) {
    if (!tags) {
        return [];
    }
    let array = [];
    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]

        if (renderMap[tag.type]) {
            array.push(renderMap[tag.type](tag.children));
        }else{
            array.push(renderMap["span"](tag.children));
        }
    }

    return array;
}