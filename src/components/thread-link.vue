<template>
  <el-row>
    <el-col :span="data.parent?19:24">
      <router-link :to="getUrl()" style="text-decoration: none">
        <el-link
            :style="threadColor(data.titlefont||data.topic_misc)"
            :href="getUrl()"
        >
          {{ data.subject }}
        </el-link>
      </router-link>
      <el-pagination v-if="data.replies>=20"
                     :current-page="currentPage"
                     layout="pager"
                     :pager-count="5"
                     :total="data.replies"
                     :page-size="20"
                     @current-change="currentChange"
      />
    </el-col>

    <el-col v-if="data.parent" :span="data.parent?5:0">
      <el-tag v-if="data.parent['2']==='版面镜像'">版面镜像</el-tag>
      <span v-if="data.parent['2']!==`版面镜像`">[{{ data.parent['2'] }}]</span>
    </el-col>

  </el-row>
</template>

<script>
import {copyObj} from "@/assets/js/utils";
import {titleStyle} from "@/assets/js/colorMap";
import {getRoute} from "@/assets/js/api/routerUtils";

export default {
  name: "thread-link",
  data() {
    return {
      currentPage: 1,
      myData: {},
    }
  },
  methods: {
    currentChange(e) {
      let tid = 'https://bbs.nga.cn/read.php?tid=';
      let url = tid + this.data.tid + "&page=" + e;
      window.open(url)
    },
    threadColor: titleStyle,
    copy(obj) {
      this.myData = obj ? copyObj(obj) : [];
    },
    getUrl() {
      let parent = this.data.parent;
      if (parent && parent["2"] === '版面镜像') {
        return getRoute(["thread",this.data["topic_misc_var"]["3"],1])
      }
      let stid = this.data["topic_misc_var"]
      if (stid && stid["1"]) {
        //  合集
        return getRoute(["thread",this.$route.params.fid,1,this.data.tid])
      }
      return getRoute(["read",this.data.tid,1])
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