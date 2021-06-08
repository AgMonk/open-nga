<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main></el-main>
    <el-footer>

    </el-footer>
  </el-container>

</template>

<script>
import {thread} from "@/assets/js/api/api";

export default {
  name: "thread",
  data() {
    return {
      myData: {}
    }
  },
  methods: {
    refreshNavi() {
      this.$store.commit("navi/updatePath")
      this.$store.commit("navi/setShow")
      this.$nextTick(() => this.$store.commit("navi/setShow"))
    },
    updateParams(){
      let fid = this.$route.params.fid;
      let page = this.$route.params.page;
      this.$store.commit("navi/setParams",{
        key:"thread",
        params:[fid,page],
      })
      this.refreshNavi();

      this.$store.dispatch("thread/getThreads",{fid,page}).then(res=>{
        console.log(res)
      })
    }
  },
  watch:{
   $route:{
     handler: function(e){
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