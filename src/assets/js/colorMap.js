// noinspection SpellCheckingInspection

let colorList = [
  {value: "AQAAAAA", key: "灰色普通"},
  {value: "AQAAACA", key: "灰色加粗"},
  {value: "AQAAAAE", key: "红色普通"},
  {value: "AQAAACE", key: "红色加粗"},
  {value: "AQAAAAQ", key: "绿色普通"},
  {value: "AQAAACQ", key: "绿色加粗"},
  {value: "AQAAAAI", key: "蓝色普通"},
  {value: "AQAAACI", key: "蓝色加粗"},
  {value: "AQAAAAg", key: "棕色普通"},
  {value: "AQAAACg", key: "棕色加粗"},
]
let colorMap={};
colorList.forEach(i=>colorMap[i.value]=i.key)

export {colorList,colorMap}

export const titleStyle = (titleFont)=> {
  let s = "";
  if (titleFont) {
    s += titleFont[5] === 'C' ? "font-weight: bold;" : "";
  } else {
    // console.log(titleFont)
    return s;
  }
  switch (titleFont[6]) {
    case "A":
      s += "color: gray;";
      break;
    case "E":
      s += "color: red;";
      break;
    case "Q":
      s += "color: green;";
      break;
    case "I":
      s += "color: blue;";
      break;
    case "g":
      s += "color: #A06700;";
      break;
  }
  return s;
}
