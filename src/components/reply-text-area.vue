<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <!--suppress HtmlUnknownTag -->
    <el-main style="padding: 0">
      <el-input v-model="myData.subject" placeholder="标题" style="margin-bottom: 5px"/>
      <el-input id="textarea" ref="reply-text-area"
                v-model="myData.content"
                :rows="myData.content.split(`\n`).length+1" placeholder="正文"
                style="margin-bottom: 5px"
                type="textarea"
      />
    </el-main>
    <el-footer>
      <el-button type="success" @click="$emit('submit',myData)">提交( Ctrl+Enter )</el-button>
      <el-button type="danger" @click="reset">重置到默认</el-button>
    </el-footer>
  </el-container>

</template>

<script>
import {copyObj} from "@/assets/js/utils";

export default {
  name: "reply-text-area",
  data() {
    return {
      myData: {
        subject: "",
        content: "",
      },
      defaultContent:{
        subject: "",
        content: "",
      },
    }
  },
  methods: {
    reset() {
      if (confirm("重置正文到默认?")) {
        this.myData = copyObj(this.defaultContent);
      }
    },
    copy(obj) {
      this.myData = obj ? copyObj(obj) : {};
      this.defaultContent = copyObj(this.myData);

      if (this.myData.content) {
        this.$refs['reply-text-area'].focus()
      }
    }
  },
  mounted() {
    this.copy(this.data)
  },
  watch: {
    "data": {
      handler: function (e) {
        this.copy(e)
      }
    }
  },
  props: ["data"],
}

</script>

<style scoped>

</style>