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
            <span v-if="!s.row['topic_misc_var']||!s.row['topic_misc_var']['1']">{{s.row.replies}}</span>
            <span v-if="s.row['topic_misc_var']&&s.row['topic_misc_var']['1']" size="mini" type="danger" @click="unFollow(s.row.tid)">
              <i class="el-icon-close" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="主题">
          <template #default="s">
            <thread-link :data="s.row" />
          </template>
        </el-table-column>
        <el-table-column label="作者/发布时间" width="170px">
          <template #default="s">
            <span v-if="s.row.author.startsWith('#anony_')">匿名用户</span>
            <div>
              <el-link
                  :href="'https://bbs.nga.cn/nuke.php?func=ucp&uid='+s.row.authorid" target="_blank"
                  v-if="!s.row.author.startsWith('#anony_')"
              >
                {{ s.row.author.length < 20 ? s.row.author : "[用户名异常]" }}
              </el-link>
            </div>
            <datetime :data="s.row.postdate"/>
          </template>
        </el-table-column>
        <el-table-column label="最后回复" width="160px">
          <template #default="s">
            <div>
              <el-link :href="'https://bbs.nga.cn/read.php?page=e&tid='+s.row.tid" target="_blank"> {{
                  s.row.lastposter
                }}
              </el-link>
            </div>
            <datetime :data="s.row.lastpost"/>
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

export default {
  name: "thread",
  components: {ThreadLink, Datetime},
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
    unFollow(id){
      if (!confirm("取消关注？")) {
        return
      }
      unFollow(id).then(res=>{
        if (res.data) {
          this.$message(res.data[0])
          this.updateThreads()
        }
      })
    },
    updateThreads(){
      let fid = this.$route.params.fid;
      let page = this.$route.params.page;
      let stid = this.$route.params.stid;
      this.$store.dispatch("thread/updateThreads", {fid, page,stid}).then(res => {
        this.handlePageData(res)
      })
    },
    page(e) {
      this.$route.params.page = e;
      this.$router.push(this.$route)
    },
    handlePageData(data) {
      // noinspection JSCheckFunctionSignatures
      this.pagination.page = parseInt(this.$route.params.page)
      this.pagination.total = data["__ROWS"]
      this.pagination.size = data["__T__ROWS_PAGE"]

      this.threads = []
      let d = data["__T"];
      Object.keys(d).forEach(key => {
        this.threads.push(d[key])
      })
      console.log(data)
    },
    refreshNavi() {
      this.$store.commit("navi/updatePath")
      this.$store.commit("navi/setShow")
      this.$nextTick(() => this.$store.commit("navi/setShow"))
    },
    updateParams() {
      let fid = this.$route.params.fid;
      let page = this.$route.params.page;
      let stid = this.$route.params.stid;
      this.$store.commit("navi/setParams", {
        key: "thread",
        params: [fid, page,stid],
      })
      this.refreshNavi();
      console.log({fid, page,stid})
      this.$store.dispatch("thread/getThreads", {fid, page,stid}).then(res => {
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