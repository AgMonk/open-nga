<!--suppress JSUnresolvedVariable -->
<template>
  <div>
    <el-container direction="vertical">
      <!--  <el-container direction="horizontal">-->
      <el-header :class="$store.state.config.config.uiColor+0" height="130px">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
          <el-breadcrumb-item v-for="(item,i) in breadcrumbs" :key="i">
            <my-router-link :params="item.params" :router="item.router" :text="item.text"/>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-button style="margin-top: 5px" type="primary" @click="updateDetails">刷新(r)</el-button>
        <el-button style="margin-top: 5px" type="primary" @click="newReply">新回复</el-button>
        <el-switch v-model="autoRefresh.enable" active-color="green" active-text="自动刷新(/3min)" inactive-color="red"
                   @change="autoRefreshChanged"
                   style="margin-left: 5px"/>
        <el-pagination
            :current-page.sync="pagination.page"
            :page-size.sync="pagination.size"
            :total="pagination.total"
            layout="prev, pager, next, jumper"
            style="margin-top: 10px"
            @current-change="page">
        </el-pagination>
      </el-header>
      <!--suppress HtmlUnknownTag -->
      <el-main style="padding: 0;border: black solid">
        <el-row
            v-for="(row,i) in replies"
            :id="'#'+row.lou"
            :key="i"
            :class="$store.state.config.config.uiColor+i%2"
        >
          <el-col :span="6">
            <reply-user-card :data="row.userInfo" :index="i"/>
          </el-col>
          <el-col :span="18">
            <reply-content-card :data="row"/>
          </el-col>

        </el-row>
      </el-main>
      <el-footer :class="$store.state.config.config.uiColor+0" height="150px">
        <el-pagination
            :current-page.sync="pagination.page"
            :page-size.sync="pagination.size"
            :total="pagination.total"
            layout="prev, pager, next, jumper"
            style="margin-top: 10px"
            @current-change="page">
        </el-pagination>
        <el-button style="margin-top: 5px" type="primary" @click="updateDetails">刷新(r)</el-button>
        <el-button style="margin-top: 5px" type="primary" @click="newReply">新回复</el-button>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 20px">
          <el-breadcrumb-item v-for="(item,i) in breadcrumbs" :key="i">
            <my-router-link :params="item.params" :router="item.router" :text="item.text"/>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-footer>
      <clock :load="lastRefreshTime"/>
    </el-container>
    <el-container direction="vertical">
      <!--suppress HtmlUnknownTag -->
      <el-main>
        <h3>快速回复</h3>
        <reply-text-area :content="content" :params="replyParams"
                         @submitted="updateDetails"/>
      </el-main>
    </el-container>
  </div>

</template>

<script>
import MyRouterLink from "@/components/my-router-link";
import ReplyUserCard from "@/components/reply-user-card";
import ReplyContentCard from "@/components/reply-content-card";
import "../assets/css/ui-color.css"
import {getRoute} from "@/assets/js/api/routerUtils";
import ReplyTextArea from "@/components/reply-text-area";
import Clock from "@/components/clock";
import {searchEmotes} from "@/assets/js/emote";

export default {
  name: "read",
  components: {Clock, ReplyTextArea, ReplyContentCard, ReplyUserCard, MyRouterLink},
  data() {
    return {
      lastRefreshTime: new Date(),
      content: "",
      subject: "",
      pagination: {
        page: 1,
        size: 20,
        total: 20,
      },
      replyParams: {},
      breadcrumbs: [],
      replies: [],

      // 当前楼层
      currentLevel: 0,

      // 自动刷新功能
      autoRefresh: {
        enable: this.$store.state.config.config.autoRefresh,
        interval: undefined,
      },
    }
  },
  methods: {
    autoRefreshChanged(e){
     this.$store.commit("config/setConfig",{key:"autoRefresh",value:e})
    },
    newReply() {
      let tid = this.$route.params.tid;
      this.$router.push(getRoute(["post", "reply", 0, tid, 0, 0]))
    },
    page(e) {
      this.$route.params.page = e;
      this.currentLevel = 0;
      this.$router.push(this.$route)
    },
    updateDetails() {
      this.$store.dispatch("read/updateDetail",this.$route.params).then(res => {
        this.handlePageData(res)
        this.lastRefreshTime = new Date();
        this.removeAutoRefresh()
        this.setAutoRefresh()
        this.$message.success("刷新成功")
      })
    },
    handlePageData(res) {
      this.replyParams = {
        tid: res.__T.tid,
        fid: res.__T.fid,
        post_subject: "",
      }

      // 设置param
      let thread = res.__T;
      let st = thread.__ST
      // console.log(st ? [thread.fid, 1, st.tid] : [thread.fid, 1])
      this.$store.commit("navi/setParams", {
        key: "thread",
        params: st ? [thread.fid, 1, st.tid] : [thread.fid, 1]
      })
      this.$store.commit("navi/updatePath")
      this.$store.commit("navi/setShow")
      this.$nextTick(() => this.$store.commit("navi/setShow"))


      this.breadcrumbs = [];
      //版面
      this.breadcrumbs.push({
        router: "thread",
        text: res.__F.name,
        params: [res.__T.fid, 1]
      })
      //主题
      this.breadcrumbs.push({
        router: "read",
        text: res.__T.subject,
        params: [res.__T.tid, 1]
      })
      //主题
      this.breadcrumbs.push({
        router: "read",
        text: "当前第{page}页".format({page: this.$route.params.page}),
        params: [res.__T.tid, this.$route.params.page]
      })

      //分页参数
      this.pagination.total = res.__ROWS;
      this.pagination.page = res.__PAGE;
      this.pagination.size = res.__R__ROWS_PAGE;

      //  用户信息
      Object.keys(res.__U).filter(key => !isNaN(key)).forEach(uid => {
        if (uid > 0) {
          this.$store.commit("account/saveUser", res.__U[uid])
          //查询赞数信息
          this.$store.dispatch("account/userInfo", uid)
        }
      })

      this.replies =  res.__R;
    },
    //更新主题详情
    updateParams() {
      let tid = this.$route.params.tid;
      let page = this.$route.params.page;
      let authorid = this.$route.params.authorid;
      let pid = this.$route.params.pid;
      //  请求详情数据
      if (page === 'e') {
        this.updateDetails()
      } else {
        this.$store.dispatch("read/getDetail", {tid, page, authorid, pid}).then(res => {
          console.log(res)
          this.handlePageData(res)
          document.body.scrollIntoView()
        }).catch(() => {
          history.back();
        })
      }
    },
    scrollLevel(c) {
      if (!this.replies[this.currentLevel + c]) {
        this.$message.error("已达到顶回复或尾回复: " + this.currentLevel)
        return;
      }
      this.currentLevel += c;
      let level = this.replies[this.currentLevel].lou;
      let element = document.getElementById("#" + level);
      element.scrollIntoView()
    },
    keypress(e) {
      if (!['BODY',"DIV"].includes(e.path[0].nodeName)) {
        console.log(e.path[0].nodeName)
        return;
      }
      if (e.key === 'r') {
        //  刷新主题列表
        this.updateDetails();
      }
      if (e.key === 'a') {
        //  上一页
        if (this.pagination.page === 1) {
          this.$message.error("已达到首页")
        } else {
          this.page(this.pagination.page - 1)
        }
      }
      if (e.key === 'd') {
        let maxPage = Math.floor(this.pagination.total / this.pagination.size + 1)
        //  下一页
        if (this.pagination.page === maxPage) {
          this.$message.error("已达到尾页 / 请尝试刷新(r)")
        } else {
          this.page(this.pagination.page - (-1))
        }

      }
      if (e.key === 's') {
        this.scrollLevel(1)
      }
      if (e.key === 'S') {
        this.scrollLevel(this.replies.length - this.currentLevel -1)
      }
      if (e.key === 'w') {
        this.scrollLevel(-1)
      }
      if (e.key === 'W') {
        this.scrollLevel(-1*this.currentLevel)
      }
      if (e.key === 'q') {
        this.$router.push(getRoute(['thread',this.replyParams.fid,1]))
      }

    },
    setAutoRefresh() {
      //  自动刷新
      this.autoRefresh.interval = setInterval(() => {
        if (this.autoRefresh.enable) {
          this.updateDetails();
        }
      }, 3 * 60 * 1000)
    },
    removeAutoRefresh() {
      clearInterval(this.autoRefresh.interval)
    },
  },
  watch: {
    $route: {
      handler: function (e) {
        //切换参数时重置当前位置
        this.currentLevel = 0;

        if (e.path.startsWith("/read")) {
          this.updateParams();
        }
      }
    }
  },
  mounted() {
    console.log(searchEmotes("哭笑"))

    this.updateParams();
    document.addEventListener('keypress', this.keypress)
    this.setAutoRefresh()
  },
  unmounted() {
    document.removeEventListener('keypress', this.keypress)
    this.removeAutoRefresh()

  }
}

</script>

<style scoped>

</style>