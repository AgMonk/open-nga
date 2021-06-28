<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h1>:: {{ title }} ::</h1>
    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
      <reply-text-area ref="reply-text-area" :params="params" focus="1"/>
      <attachments :data="attachs" @add-file="addFile" />
      <my-upload :attach-url="`/attach`" :auth="auth" :fid="params.fid" :index="1"
                 @add-file="addFile"
                 @file-list-changed="fileListChanged"
      />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {prePost} from "@/assets/js/api/postApi";
import {copyObj} from "@/assets/js/utils";
import ReplyTextArea from "@/components/reply-text-area";
import "../assets/css/ui-color.css"
import MyUpload from "@/components/my-upload";
import {obj2Array} from "@/assets/js/api/nga-request";
import Attachments from "@/components/attachments";

export default {
  name: "post",
  components: {Attachments, MyUpload, ReplyTextArea},
  data() {
    return {
      title: "",
      myData: {},
      content: "",
      attachUrl: "",
      attachs: [],
      auth: "",
      params: {
        fid: 0,
        tid: 0,
        pid: 0,
        action: 0,
        post_content: "",
        post_subject: "",
        attachments: "",
        attachments_check: "",
      },
    }
  },
  methods: {
    addFile(file) {
      console.log(file)
      if (file.isImg) {
        let text = `[img]./` + file.url + `[/img]`
        this.$refs["reply-text-area"].addText(text)
      } else {
        this.$message.error("文件不是图片")
      }
    },
    fileListChanged(e) {
      let array = e.map(r => r.response).filter(r => r);
      let params = copyObj(this.params)
      params.attachments = array.map(r => r.attachments).join('\t')
      params.attachments_check = array.map(r => r.attachments_check).join('\t')

      this.params = params;
    }
  },
  mounted() {


    console.clear()
    let params = copyObj(this.$route.params);

    let action = this.$route.params.action;
    switch (action) {
      case "quote":
        this.title = "回复/引用";
        break;
      case "reply":
        this.title = "回复";
        break;
      case "modify":
        this.title = "编辑";
        break;
      case "new":
        this.title = "发布主题";
        break;
    }

    prePost(params).then(res => {
      if (!res.__MESSAGE) {
        params.post_content = res.content ? res.content : "";

        params.post_content = params.post_content
            .replace(/&quot;/g, "\"")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&#39;/g, "'")

        this.attachUrl = res.attach_url
        this.auth = res.auth;
        res.attachs = res.attachs ? obj2Array(res.attachs) : []
        this.attachs = res.attachs

        params.action = res.action;
        params.fid = res.fid;
        params.post_subject = res.subject;
        this.params = params
      } else {
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