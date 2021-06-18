<script>
import {parseBbsCode} from "@/assets/js/bbsCode/bbsCodeParser";
import MyRouterLink from "@/components/my-router-link";

export default {
  name: "content-render",
  components: {MyRouterLink},
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
        "quote": (children) => <el-card
            className="box-card"
            body-style="padding:10px;border: 1px solid #81a3f3;background-color: #70cef742;">
          {this.render(children)}</el-card>,
        "h": (children) => <h3 style="margin: 8px auto;">{this.render(children)}</h3>,
        "ul": (children) => <ul>{this.render(children)}</ul>,
        "li": (children) => <li>{this.render(children)}</li>,
        "pid": (children, props) => <my-router-link router="read" params={[props.split(',')[0]]}
                                                    text={"[" + children[0].children + "]"}/>,
        "url": (children, props) => {
          let url = props !== '' ? props : children[0].children;
          let text = props !== '' ? children[0].children : "[链接]";
          console.log(text+" -> "+url)
          let ngaUrlRegExp = /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|ngabbs\.com)\/(.+?)\.php\?(.+)/
          let match = ngaUrlRegExp.exec(url)
          let router;
          let params;
          if (match) {
            //  站内链接
            router = match[2];
            params = match[3];
            text = "[站内链接]"

            let paramMap = {};
            params.split("&").forEach(p => {
              let s = p.split("=");
              paramMap[s[0]] = s[1];
            })

            let page = paramMap.page ? paramMap.page : 1
            if (router === "thread") {
              if (paramMap.authorid) {
                //  指定用户的主题 或 回复
                params = [paramMap.fid, page, paramMap.authorid, paramMap.searchpost]
              } else if (paramMap.stid) {
                params = [paramMap.fid, page, paramMap.stid]
              } else {
                params = [paramMap.fid, page]
              }
            } else if (router === "read") {
              if (paramMap.pid) {
                params = [paramMap.pid]
              } else if (paramMap.authorid) {
                params = [paramMap.tid,page,paramMap.authorid]
              } else{
                params = [paramMap.tid,page]
              }
            }

          }
          if (typeof params === 'object') {
            console.log("1")
            return <my-router-link router={router} params={params} text={text} linkStyle="color:red" />
          }
            console.log("2")
          return <el-link href={url} linkStyle="color:blue">{text}</el-link>
        },
        "span": (children) => <span>{children}</span>,
      }

      let array = [];
      for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]

        let render = renderMap[tag.type];
        if (render) {
          array.push(render(tag.children, tag.props));
        } else {
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