// 快捷输入论坛代码

export const bbsCodeLibrary = [
    {
        name: {cn: "颜色", en: "color"},
        props: [
            {cn: "红", en: "red"},
            {cn: "蓝", en: "blue"},
            {cn: "天蓝", en: "skyblue"},
            {cn: "绿", en: "green"},
            {cn: "橙", en: "orange"},
            {cn: "粉", en: "deeppink"},
            {cn: "紫", en: "purple"},
            {cn: "银", en: "silver"},
        ],
    },
    {
        name: {cn: "字号", en: "size"},
        props: [
            {cn: "100", en: "100%"},
            {cn: "120", en: "120%"},
            {cn: "150", en: "150%"},
            {cn: "200", en: "200%"},
        ],
    },
    {name: {cn: "加粗", en: "b"},},
    {name: {cn: "删除线", en: "del"},},
    {name: {cn: "标题", en: "h"},},
    {name: {cn: "列表", en: "list"},},
    {name: {cn: "列表项", en: "*"},},
    {name: {cn: "图片", en: "img"},},
    {name: {cn: "链接", en: "url"},},
    {name: {cn: "引用", en: "quote"},},
    {name: {cn: "代码", en: "code"},},
    {name: {cn: "表格", en: "table"},},
    {name: {cn: "行", en: "tr"},},
    {name: {cn: "列", en: "td"},},
    {name: {cn: "折叠", short: ["col"], en: "collapse"},},
]

let equalsName = (nameObj, destName) => (
    nameObj.cn === destName
    || nameObj.en === destName
    || (nameObj.short && nameObj.short.includes(destName))
)

export const searchBbsCode = (key) => {
    key = key.replace(`：`, `:`);
    let name = key.includes(":") ? key.split(":")[0] : key;
    let props = key.includes(":") ? key.split(":")[1] : undefined;
    let array = []
    bbsCodeLibrary
        // 过滤 名称符合的code
        .filter(group => equalsName(group.name, name))
        .forEach(group => {
            name = group.name.en;

            let gProps = group.props
            if (gProps && props) {
                for (let i = 0; i < gProps.length; i++) {
                    if (equalsName(gProps[i], props)) {
                        props = gProps[i].en;
                        break;
                    }
                }
            }
            let startText = "[" + name + (props ? "=" + props : "") + "]"
            let endText = name === '*' ? `` : "[/" + name + "]";
            array.push({startText, endText})
        })

    return array;

}