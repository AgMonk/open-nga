<script>
import {parseBbsCode} from "@/assets/js/bbsCodeParser";
import MyRouterLink from "@/components/my-router-link";
import {getEmoteUrl} from "@/assets/js/emote";

export default {
  name: "content-render",
  components: {MyRouterLink},
  render() {
    return this.render(parseBbsCode(this.content))
    // return this.render(this.myData, 2)
  },
  date() {
    return {
      myData: [],
      collapseExpanded: "",
    }
  },
  methods: {
    // 渲染器 接收一个解析对象数组 返回一个对应的标签数组
    render(tags) {
      if (!tags) {
        return [];
      }

      let renderMap = {
        "collapse": (children, props) => {
          let title = props ? "[折叠内容]: " + props : "[折叠内容]";
          return <el-collapse>
            <el-collapse-item title={title}>
              {this.render(children)}
            </el-collapse-item>
          </el-collapse>
        },
        "quote": (children) => {
          return <el-card
              className="box-card"
              body-style="padding:10px;border: 1px solid #81a3f3;background-color: #0cb2fb1f;">
            {this.render(children)}</el-card>
        },
        "img": (children) => {
          // let proxy = "https://images.weserv.nl/?url=img.nga.178.com/attachments"
          let proxy = "/img"
          let url = children[0].children;
          if (url.startsWith("./mon")) {
            //  站内图片
            let imgSrc = proxy + url.substring(1)
                    // let imgSrc = "/img"+url.substring(1)
                    .replace(".thumb.jpg", "")
                    .replace(".medium.jpg", "")
                // .replace("https","http")
            ;
            return <el-link href={imgSrc} target="_blank">
              <el-image src={imgSrc}/>
            </el-link>
          }
          return <el-link href={url} target="_blank">
            外链图片
          </el-link>
        },
        "url": (children, props) => {
          let url = props !== '' ? props : children[0].children;
          if (url.startsWith("/read.php?tid=")) {
            url = "https://bbs.nga.cn" + url;
          }
          let ngaUrlRegExp = /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|ngabbs\.com)\/(.+?)\.php\?(.+)/
          let match = ngaUrlRegExp.exec(url)
          let router;
          let params;
          if (match) {
            //  站内链接
            router = match[2];
            params = match[3];

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
                params = [paramMap.tid, page, paramMap.authorid]
              } else {
                params = [paramMap.tid, page]
              }
            }

          }
          if (typeof params === 'object') {
            return <my-router-link router={router} params={params} linkStyle="color:red">{this.render(children)}</my-router-link>
          }
          return <el-link target="_blank" href={url} linkStyle="color:blue">{this.render(children)}</el-link>
        },
        "ul": (children) => <ul>{this.render(children)}</ul>,
        "h": (children) => <h3 style="margin: 8px auto;">{this.render(children)}</h3>,
        "b": (children) => <b>{this.render(children)}</b>,
        "u": (children) => <u>{this.render(children)}</u>,
        "i": (children) => <i>{this.render(children)}</i>,
        "li": (children) => <li>{this.render(children)}</li>,
        "del": (children) => <del>{this.render(children)}</del>,
        "uid": (children, props) => <my-router-link router="account" params={[props]}
                                                    text={"[" + children[0].children + "]"}/>,
        "pid": (children, props) => <my-router-link router="read" params={[props.split(',')[0]]}
                                                    text={"[" + children[0].children + "]"}/>,
        "tid": (children, props) => <my-router-link router="read" params={[props, 1]}
                                                    text={"[" + children[0].children + "]"}/>,
        "color": (children, props) => <span style={'color: ' + props}>{this.render(children)}</span>,
        "size": (children, props) => <span style={"font-size:" + props}>{this.render(children)}</span>,
        "align": (children, props) => <span style={"text-align:" + props}>{this.render(children)}</span>,
        "code": (children) => {
          let text = children
              .replace(/<br\/>/g, "\n")
          ;
          return <div style="background-color: black;color: #bfcddc">
            <pre>{text}</pre>
          </div>
        },
        "span": (children) => {
          let regExp = /\[s:(.*?):(.+?)]/g
          let r;
          let startIndex = 0;
          if (children.match(regExp)) {
            // 有官方表情
            let array = [];
            while (r = regExp.exec(children)) {
              array.push(<span style="white-space: pre-line">{children.substring(startIndex, r.index)}</span>)

              //获取表情图地址
              let namespace = r[1];
              let key = r[2];
              let url = getEmoteUrl(namespace, key)
              url = url.replace("https://", "")
              //插入图片
              array.push(<el-image src={url}/>)
              //  更新起始位置
              startIndex = r.index + r[0].length;
            }
            array.push(<span style="white-space: pre-line">{children.substring(startIndex)}</span>)
            return array;
          }
          return <span style="white-space: pre-line">{children}</span>
        },
      }

      let array = [];
      for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]

        let render = renderMap[tag.type];
        if (render) {
          array.push(render(tag.children, tag.props));
        } else {
          console.log("未知标签： " + tag.type)
          // array.push(renderMap['span'](tag.children));
          array.push(<span style="white-space: pre-line">{tag.raw}</span>);
        }

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
        // console.log(this.myData)
      }
    }
  },
  props: ["content"],
}

</script>

<style scoped>
</style>