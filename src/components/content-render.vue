<script>
import {parseBbsCode} from "@/assets/js/bbsCode/bbsCodeParser";

export default {
  name: "content-render",
  render() {
    return this.render(this.myData, 2)
  },
  date() {
    return {
      myData: [],
    }
  },
  methods: {
    // 渲染器 接收一个解析对象数组 返回一个对应的标签数组
    render(tags) {
      if (!tags) {
        return [];
      }

      let renderMap = {
        "quote": (children) => <el-card className="box-card"
                                        body-style="padding:10px;border: 1px solid #81a3f3;background-color: #70cef742;">
          {this.render(children)}</el-card>,
        "h": (children) => <h3 style="margin: 8px auto;">{this.render(children)}</h3>,
        "ul": (children) => <ul>{this.render(children)}</ul>,
        "li": (children) => <li>{this.render(children)}</li>,
        "span": (children) => <span>{children}</span>,
      }

      let array = [];
      for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]

        let render = renderMap[tag.type];
        if (render) {
          array.push(render(tag.children));
        }else{
          array.push(renderMap['span'](tag.children));
        }
        // switch (tag.type) {
        //   case "quote":
        //     array.push(<el-card class="box-card"
        //                         body-style="padding:10px;border: 1px solid #81a3f3;background-color: #70cef742;">
        //       {this.render(tag.children)}</el-card>);
        //     break;
        //   case "h":
        //     array.push(<h3 style="margin: 8px auto;">{this.render(tag.children)}</h3>);
        //     break;
        //   case "ul":
        //     array.push(<ul>{this.render(tag.children)}</ul>);
        //     break;
        //   case "li":
        //     array.push(<li>{this.render(tag.children)}</li>);
        //     break;
        //   case "span":
        //     array.push(<span>{tag.children}</span>);
        //     break;
        //   default:
        //     array.push(<span>{tag.children}</span>);
        //     break;
        //
        // }

      }

      return array;
    }
  },
  mounted() {
    // this.myData = parseBbsCode(this.content)
    // console.log(parseBbsCode(this.content))
  },
  watch: {
    "content": {
      handler: function (e) {
        this.myData = parseBbsCode(e)
        console.log(this.myData)
      }
    }
  },
  props: ["content"],
}

</script>

<style scoped>
</style>