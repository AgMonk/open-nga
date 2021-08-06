<!--版头-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <content-render :content="content" />
    </el-main>
<!--    <el-footer>    </el-footer>-->
  </el-container>

</template>

<script>
import ContentRender from "@/components/content-render";

export default {
  name: "topped-topic",
  components: {ContentRender},
  data() {
    return {
      toppedTopicTid: undefined,
      content:"",
    }
  },
  methods: {
    readToppedTopic() {
      if (!this.toppedTopicTid) {
        return;
      }
      this.$store.dispatch("read/getDetail", {tid: this.toppedTopicTid, page: 1}).then(res => {
        console.log(res.__R[0])
        this.content = res.__R[0].content;
      })

      /*todo 表格标签适配后再做 */
    }
  },
  mounted() {
    this.toppedTopicTid = this.tid
    this.readToppedTopic()
  },
  watch: {
    "tid": {
      handler: function (e) {
        this.toppedTopicTid = e
        this.readToppedTopic()
      }
    }
  },
  props: {
    tid: {
      required: true,
    }
  },
}

</script>

<style scoped>

</style>