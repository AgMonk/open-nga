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
        <el-button style="margin-top: 5px" type="primary" @click="updateDetails">刷新</el-button>
        <el-button style="margin-top: 5px" type="primary" @click="newReply">新回复</el-button>
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
        <el-row v-for="(row,i) in replies" :key="i" :class="$store.state.config.config.uiColor+i%2">
          <el-col :span="6">
            <reply-user-card :data="row.userInfo" :index="i"/>
          </el-col>
          <el-col :span="18">
            <reply-content-card :ref="'#'+row.lou" :data="row"/>
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
        <el-button style="margin-top: 5px" type="primary" @click="updateDetails">刷新</el-button>
        <el-button style="margin-top: 5px" type="primary" @click="newReply">新回复</el-button>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 20px">
          <el-breadcrumb-item v-for="(item,i) in breadcrumbs" :key="i">
            <my-router-link :params="item.params" :router="item.router" :text="item.text"/>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-footer>
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

export default {
  name: "read",
  components: {ReplyTextArea, ReplyContentCard, ReplyUserCard, MyRouterLink},
  data() {
    return {
      content: "",
      subject: "",
      pagination: {
        page: 1,
        size: 20,
        total: 20,
      },
      replyParams:{},
      breadcrumbs: [],
      replies: [],
    }
  },
  methods: {
    newReply() {
      let tid = this.$route.params.tid;
      this.$router.push(getRoute(["post", "reply", 0, tid, 0, 0]))
    },
    page(e) {
      this.$route.params.page = e;
      this.$router.push(this.$route)
    },
    updateDetails() {
      let tid = this.$route.params.tid;
      let page = this.$route.params.page;
      let authorid = this.$route.params.authorid;
      let pid = this.$route.params.pid;
      this.$store.dispatch("read/updateDetail", {tid, page,authorid, pid}).then(res => {
        this.handlePageData(res)
        this.$message.success("刷新成功")
      })
    },
    handlePageData(res) {

      this.replyParams = {
        tid:res.__T.tid,
        post_subject:"",
      }

      // 设置param
      let thread = res.__T;
      let st = thread.__ST
      console.log(st?[thread.fid,1,st.tid]:[thread.fid,1])
      this.$store.commit("navi/setParams", {
        key: "thread",
        params: st?[thread.fid,1,st.tid]:[thread.fid,1]
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

      this.replies = res.__R;

      if (this.$route.params.page === 'e') {
        this.$route.params.page = res.__PAGE;
        this.$router.push(this.$route)
      }


      // console.log(this.$refs['#'+this.replies[0].lou])
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
      }else{
        this.$store.dispatch("read/getDetail", {tid, page, authorid, pid}).then(res => {
          console.log(res)
          this.handlePageData(res)
          document.body.scrollIntoView()
        })
      }
    },
  },
  watch: {
    $route: {
      handler: function (e) {
        if (e.path.startsWith("/read")) {
          this.updateParams();
        }
      }
    }
  },
  mounted() {
    this.updateParams();
  },
}

</script>

<style scoped>

</style>