<!--suppress HtmlUnknownAttribute -->
<template>
  <div>
    <h2>
      <my-router-link :params="[fid,1]" router="thread">{{ forumName }}</my-router-link>
    </h2>
    <el-switch v-if="!$route.path.includes(`recommend`)" v-model="showToppedTopic" active-text="显示版头" @change="showToppedTopicChanged"/>
    <topped-topic v-if="config.showToppedTopic && !$route.path.includes(`recommend`)" :tid="toppedTopicTid"/>
    <el-container ref="threadList" direction="vertical">
      <!--  <el-container direction="horizontal">-->
      <el-header>
        <div>
          <el-button type="primary" @click="updateThreads">刷新(r)</el-button>
          <el-button type="primary" @click="newThread">发帖</el-button>
          <el-switch v-model="orderByPostDateDesc" active-text="按发布时间排序" style="margin-left: 10px"
                     @click="$store.state.thread.orderByPostDateDesc=orderByPostDateDesc;updateThreads()"/>
        </div>
        <el-pagination
            :current-page.sync="pagination.page"
            :page-size.sync="pagination.size"
            :total="pagination.total"
            layout="prev, pager, next, jumper"
            @current-change="page">
        </el-pagination>
      </el-header>
      <!--suppress HtmlUnknownTag -->
      <el-main>


        <div>
          <sub-forum v-for="(item,i) in subForums" :key="i" :data="item"/>
          <my-router-link v-if="!$route.path.includes(`recommend`)"  :params="[`recommend`,fid,1]" router="thread" style="margin-left: 30px" >精华区</my-router-link>

        </div>

        <el-table :cell-class-name="cellClassName" :data="threads" :header-cell-class-name="$store.state.config.config.uiColor+'1'">
          <el-table-column label="#" width="40px">
            <template #default="s">
              {{ s.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="回复" prop="replies" sortable width="80px">
            <template #default="s">
            <span v-if="s.row['topic_misc_var']&&s.row['topic_misc_var']['1']===33" @click="unFollow(s.row.tid)">
              <i class="el-icon-close"/>
            </span>
              <span v-else>{{ s.row.replies }}</span>
            </template>
          </el-table-column>
          <el-table-column label="主题">
            <template #default="s">
              <thread-link :data="s.row" :index="s.$index"/>
            </template>
          </el-table-column>
          <el-table-column label="作者/发布时间" width="170px">
            <template #default="s">
              <div>
                <user-link :id="s.row.authorid" :username="s.row.author"/>
              </div>
              <datetime :data="s.row.postdate"/>
            </template>
          </el-table-column>
          <el-table-column label="最后回复" width="160px">
            <template #default="s">
              <div>
                <datetime :data="s.row.lastpost"/>
              </div>
              {{ s.row.lastposter }}
            </template>
          </el-table-column>


        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
            :current-page.sync="pagination.page"
            :page-size.sync="pagination.size"
            :total="pagination.total"
            layout="prev, pager, next, jumper"
            @current-change="page">
        </el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {unFollow} from "@/assets/js/api/api";
import Datetime from "@/components/datetime";
import ThreadLink from "@/components/thread-link";
import UserLink from "@/components/user-link";
import {getRoute} from "@/assets/js/api/routerUtils";
import "../assets/css/ui-color.css"
import ToppedTopic from "@/components/topped-topic";
import SubForum from "@/components/sub-forum";
import MyRouterLink from "@/components/my-router-link";
import {mapMutations, mapState} from "vuex";
import {setTitle} from "@/assets/js/projectUtils";

export default {
  name: "thread",
  components: {MyRouterLink, SubForum, ToppedTopic, UserLink, ThreadLink, Datetime},
  data() {
    return {
      pagination: {
        page: 1,
        size: 35,
        total: 35,
      },
      threads: [],
      orderByPostDateDesc: this.$store.state.thread.orderByPostDateDesc,
      toppedTopicTid: undefined,
      showToppedTopic: false,
      subForums: [],
      forumName: "",
      fid: 0,
    }
  },
  computed: {
    ...mapState("config", [`config`]),
  },
  methods: {
    ...mapMutations("config", [`setConfig`]),
    showToppedTopicChanged(e) {
      //切换“显示版头”开关
      this.setConfig({key: "showToppedTopic", value: e});
    },
    cellClassName({rowIndex}) {
      return this.$store.state.config.config.uiColor + rowIndex % 2
    },
    newThread() {
      let fid = this.$route.params.fid;
      this.$router.push(getRoute(["post", "new", fid, 0, 0, 0]))
    },
    unFollow(id) {
      if (!confirm("取消关注？")) {
        return
      }
      let fid = this.$route.params.fid;
      unFollow(id, fid).then(res => {
        if (res.data) {
          this.$message(res.data[0])
          this.updateThreads()
        }
      })
    },
    updateThreads() {
      this.$store.dispatch("thread/updateThreads", this.getParams()).then(res => {
        this.handlePageData(res)
        this.$message.success("刷新成功")
      })
    },
    page(e) {
      this.$route.params.page = e ? e : 1;
      this.$router.push(this.$route)
    },
    //处理分页数据
    handlePageData(data) {
      // 分页参数
      // noinspection JSCheckFunctionSignatures
      this.pagination.page = parseInt(this.$route.params.page)
      this.pagination.total = data["__ROWS"] !== '' ? data["__ROWS"] : 9999999;
      this.pagination.size = data["__T__ROWS_PAGE"]

      //主题列表
      this.threads = []
      let d = data["__T"];
      Object.keys(d).forEach(key => {
        this.threads.push(d[key])
      })

      //更新 uid 到 username 映射
      this.threads.map(thread => {
        return {
          uid: thread.authorid,
          username: thread.author
        }
      }).forEach(user => {
        if (!this.$store.state.account.users[user.uid] || !this.$store.state.account.users[user.uid].username) {
          this.$store.commit("account/saveUser", user)
        }
      })

      this.toppedTopicTid = data.__F.topped_topic
      this.subForums = data.__F.subForums;
      this.forumName = data.__F.name;
      this.fid = data.__F.fid;

      console.log(data)
      setTitle(this.forumName)
    },
    //更新主题列表
    getThreads() {
      this.$store.dispatch("thread/getThreads",this.getParams()).then(res => {
        this.handlePageData(res)
      })
    },
    getParams(){
      return {
        favor: (this.$route.path.includes("favor") ? 1 : undefined),
        recommend: (this.$route.path.includes("recommend") ? 1 : undefined),
        ...this.$route.params
      }
    },
    keypress(e) {
      if (e.key === 'z') {
        //  后腿
        history.back();
      }
      if (e.key === 'c') {
        //  前进
        history.forward()
      }

      if (e.key === 'r' && e.path[0].nodeName === 'BODY') {
        //  刷新主题列表
        this.updateThreads();
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
    },
  },
  watch: {
    $route: {
      handler: function (e) {
        if (e.path.startsWith("/thread")) {
          this.getThreads();
        }
      }
    }
  },
  mounted() {
    this.getThreads();
    console.log(this.$route)
    document.addEventListener('keypress', this.keypress)

    this.showToppedTopic = this.config.showToppedTopic;
  },
  unmounted() {
    document.removeEventListener('keypress', this.keypress)
  }
}

</script>

<style scoped>

</style>