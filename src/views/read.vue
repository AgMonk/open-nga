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
export default {
  name: "read",
  data() {
    return {
      myData: {}
    }
  },
  methods: {
    copy(obj) {
      this.myData = obj ? copyObj(obj) : [];
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