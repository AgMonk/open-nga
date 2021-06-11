<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <div>
        <el-button type="primary" @click="updateThreads">刷新</el-button>
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
      <el-table :data="threads">
        <el-table-column label="#" width="40px">
          <template #default="s">
            {{ s.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="回复" prop="replies" width="60px">
          <template #default="s">
            <span v-if="!s.row['topic_misc_var']||!s.row['topic_misc_var']['1']">{{ s.row.replies }}</span>
            <span v-if="s.row['topic_misc_var']&&s.row['topic_misc_var']['1']" @click="unFollow(s.row.tid)">
              <i class="el-icon-close"/>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="主题">
          <template #default="s">
            <thread-link :data="s.row"/>
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

</template>

<script>
import {thread, unFollow} from "@/assets/js/api/api";
import Datetime from "@/components/datetime";
import ThreadLink from "@/components/thread-link";
import UserLink from "@/components/user-link";

export default {
  name: "thread",
  components: {UserLink, ThreadLink, Datetime},
  data() {
    return {
      pagination: {
        page: 1,
        size: 35,
        total: 35,
      },
      threads: [],
    }
  },
  methods: {
    unFollow(id) {
      if (!confirm("取消关注？")) {
        return
      }
      unFollow(id).then(res => {
        if (res.data) {
          this.$message(res.data[0])
          this.updateThreads()
        }
      })
    },
    updateThreads() {
      let fid = this.$route.params.fid;
      let page = this.$route.params.page;
      let stid = this.$route.params.stid;
      this.$store.dispatch("thread/updateThreads", {fid, page, stid}).then(res => {
        this.handlePageData(res)
        this.$message.success("刷新成功")
      })
    },
    page(e) {
      this.$route.params.page = e;
      this.$router.push(this.$route)
    },
    //处理分页数据
    handlePageData(data) {
      // 分页参数
      // noinspection JSCheckFunctionSignatures
      this.pagination.page = parseInt(this.$route.params.page)
      this.pagination.total = data["__ROWS"]
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

      console.log(data)
    },
    refreshNavi() {
      this.$store.commit("navi/updatePath")
      this.$store.commit("navi/setShow")
      this.$nextTick(() => this.$store.commit("navi/setShow"))
    },
    //更新主题列表
    updateParams() {
      let fid = this.$route.params.fid;
      let page = this.$route.params.page;
      let stid = this.$route.params.stid;
      this.$store.commit("navi/setParams", {
        key: "thread",
        params: [fid, page, stid],
      })
      this.refreshNavi();
      this.$store.dispatch("thread/getThreads", {fid, page, stid}).then(res => {
        this.handlePageData(res)
      })
    }
  },
  watch: {
    $route: {
      handler: function (e) {
        if (e.path.startsWith("/thread")) {
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