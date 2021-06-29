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
    },
    {
        name: {cn: "加粗", en: "b"},
    },
]

let equalsName = (nameObj, destName) => (nameObj.cn === destName || nameObj.en === destName)

export const searchBbsCode = (key) => {
    key = key.replace(`：`, `:`);
    let name = key.includes(":") ? key.split(":")[0] : key;
    let props = key.includes(":") ? key.split(":")[1] : undefined;
    let array = []
    bbsCodeLibrary
        // 过滤 名称符合的code
        .filter(group => equalsName(group.name,name))
        .forEach(group=>{
            name = group.name.en;

            let gProps = group.props
            if (gProps && props) {
                for (let i = 0; i < gProps.length; i++) {
                    if (equalsName(gProps[i],props)){
                        props = gProps[i].en;
                        break;
                    }
                }
            }
            let start = "["+name+ (props?"="+props:"") +"]"
            let end  = "[/"+name+"]";
            array.push({start,end})
        })

    return array;

}