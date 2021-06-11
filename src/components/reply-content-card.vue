<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header height="30px" style="padding: 0 10px">
      <el-row>
        <el-tag class="miniTag" size="mini">#{{ myData.lou }}</el-tag>
        <el-tag class="miniTag" size="mini">{{ myData.postdate }}</el-tag>
        <el-tag class="miniTag" size="mini" @click="readOnly">只看</el-tag>
        <el-tag v-if="myData.lastEdit" class="miniTag" size="mini">E:{{ myData.lastEdit }}</el-tag>
      </el-row>
    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main style="padding: 10px">
      {{ myData.content }}
    </el-main>
    <el-footer style="padding: 0 10px"></el-footer>
  </el-container>

</template>

<script>
import {copyObj} from "@/assets/js/utils";
import {getRoute} from "@/assets/js/api/routerUtils";

export default {
  name: "reply-content-card",
  data() {
    return {
      myData: {}
    }
  },
  methods: {
    readOnly(){
      let tid = this.$route.params.tid;
      let authorid = this.myData.authorid;
      this.$router.push(getRoute(["read",tid,1,authorid]))
    },
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
.miniTag{
  margin-left: 3px;
}
</style>