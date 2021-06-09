<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
        <el-breadcrumb-item v-for="(item,i) in breadcrumbs" :key="i" >
          <my-router-link :params="item.params" :router="item.router" :text="item.text" />
        </el-breadcrumb-item>
      </el-breadcrumb>
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
    <el-main></el-main>
    <el-footer>
      <el-pagination
          :current-page.sync="pagination.page"
          :page-size.sync="pagination.size"
          :total="pagination.total"
          layout="prev, pager, next, jumper"
          style="margin-top: 10px"
          @current-change="page">
      </el-pagination>
    </el-footer>
  </el-container>

</template>

<script>
import MyRouterLink from "@/components/my-router-link";

export default {
  name: "read",
  components: {MyRouterLink},
  data() {
    return {
      pagination: {
        page: 1,
        size: 20,
        total: 20,
      },
      breadcrumbs:[],
    }
  },
  methods: {
    page(e) {
      this.$route.params.page = e;
      this.$router.push(this.$route)
    },
    refreshNavi() {
      this.$store.commit("navi/updatePath")
      this.$store.commit("navi/setShow")
      this.$nextTick(() => this.$store.commit("navi/setShow"))
    },
    //更新主题详情
    updateParams() {
      let tid = this.$route.params.tid;
      let page = this.$route.params.page;
      this.$store.commit("navi/setParams", {
        key: "read",
        params: [tid, page],
      })
      this.refreshNavi();

    //  请求详情数据
     this.$store.dispatch("read/getDetail",{tid,page}).then(res=>{
       console.log(res)
       this.breadcrumbs = [];
       //版面
       this.breadcrumbs.push({
         router:"thread",
         text:res.__F.name,
         params:[res.__T.fid,1]
       })
       //主题
       this.breadcrumbs.push({
         router:"read",
         text:res.__T.subject,
         params:[res.__T.tid,1]
       })
      //主题
       this.breadcrumbs.push({
         router:"read",
         text:"当前第{page}页".format({page:this.$route.params.page}),
         params:[res.__T.tid,this.$route.params.page]
       })

       //分页参数
       this.pagination.total = res.__ROWS;
       this.pagination.page = res.__PAGE;
       this.pagination.size = res.__R__ROWS_PAGE;

     //  用户信息
       Object.keys(res.__U).filter(key=>!isNaN(key)).forEach(uid=>{
          this.$store.commit("account/saveUser",res.__U[uid])
       })
     })
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