<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main></el-main>
    <el-footer></el-footer>
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
  },
  mounted() {
    thread(this.$route.params.fid,this.$route.params.page).then(res=>{
      console.log(res)
    })
  },
}

</script>

<style scoped>

</style>