<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h1>:: {{ title }} ::</h1>
    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
        <reply-text-area :data="{subject:params.post_subject,content}" @submit="submit" />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {doPost, prePost} from "@/assets/js/api/postApi";
import {copyObj} from "@/assets/js/utils";
import ReplyTextArea from "@/components/reply-text-area";

export default {
  name: "post",
  components: {ReplyTextArea},
  data() {
    return {
      title:"",
      myData: {},
      content: "",
      attachUrl: "",
      auth: "",
      params: {
        fid: 0,
        tid: 0,
        pid: 0,
        action: 0,
        post_subject: "",
        attachments: "",
        attachments_check: "",
      },
    }
  },
  methods: {
    submit(e){
      console.log(e)
      this.params.post_subject = e.subject;
      this.content = e.content;

      doPost(params,this.content+"\n"+"测试").then(res=>{
        console.log(res)
      })
    }
  },
  mounted() {
    console.clear()
    let params = copyObj(this.$route.params);

    let action = this.$route.params.action;
    switch (action){
      case "quote":this.title = "回复/引用";break;
      case "reply":this.title = "回复";break;
      case "modify":this.title = "编辑";break;
      case "new":this.title = "发布主题";break;
    }

    prePost(params).then(res => {
      console.log(res)
      this.content = res.content;
      this.attachUrl = res.attach_url
      this.auth = res.auth;

      params.action = res.action;
      params.post_subject = res.subject;
      this.params = params
      // doPost(params,this.content+"\n"+"测试").then(res=>{
      //   console.log(res)
      // })
    })
  },
  watch: {},
}

</script>

<style scoped>

</style>