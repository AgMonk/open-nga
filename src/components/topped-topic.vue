<!--版头-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

<!--    <el-main></el-main>-->
<!--    <el-footer>    </el-footer>-->
  </el-container>

</template>

<script>
export default {
  name: "topped-topic",
  data() {
    return {
      toppedTopicTid: undefined,
      firstReply: {}
    }
  },
  methods: {
    readToppedTopic() {
      if (!this.toppedTopicTid) {
        return;
      }
      // this.$store.dispatch("read/getDetail", {tid: this.toppedTopicTid, page: 1}).then(res => {
      //   console.log(res)
      //   this.firstReply = res.__R[0]
      //   console.log(res.__R[0])
      // })

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