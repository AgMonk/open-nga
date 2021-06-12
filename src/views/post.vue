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
import {prePost} from "@/assets/js/api/postApi";
import {copyObj} from "@/assets/js/utils";

export default {
  name: "post",
  data() {
    return {
      myData: {},
      content:"",
      attachUrl:"",
      auth:"",

    }
  },
  methods: {
  },
  mounted() {
    console.clear()
    let params = copyObj(this.$route.params);
    prePost(params).then(res=>{
      console.log(res)
      params.action = res.action;
      this.content = res.content;
      this.attachUrl = res.attach_url
      this.auth = res.auth;
      console.log(params)

      // doPost(params,this.content+"\n"+"测试").then(res=>{
      //   console.log(res)
      // })
    })
  },
  watch: {
  },
}

</script>

<style scoped>

</style>