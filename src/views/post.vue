<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h1>:: {{ title }} ::</h1>
    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
        <reply-text-area :content="content" :params="params" focus="1" />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {prePost} from "@/assets/js/api/postApi";
import {copyObj} from "@/assets/js/utils";
import ReplyTextArea from "@/components/reply-text-area";
import "../assets/css/ui-color.css"

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
      if (!res.__MESSAGE) {
        this.content = res.content ? res.content : "";

        this.content = this.content
            .replace(/&quot;/g, "\"")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&#39;/g, "'")

        this.attachUrl = res.attach_url
        this.auth = res.auth;

        params.action = res.action;
        params.post_subject = res.subject;
        this.params = params
      }else{
        this.$message.error(res.__MESSAGE["1"]);
        history.back();
      }
    })
  },
  watch: {},
}

</script>

<style scoped>

</style>