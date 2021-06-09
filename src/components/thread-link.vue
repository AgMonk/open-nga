<template>
  <el-row>
    <el-col :span="data.parent?19:24">
      <el-link
          :style="threadColor(data.titlefont||data.topic_misc)"
          :href="getUrl()" target="_blank"
      >
        {{ data.subject }}
      </el-link>
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
      <router-link v-if="data.parent['2']!==`版面镜像`" :to="'/thread/'+data.parent['0']+'/1'">[{{ data.parent['2'] }}]</router-link>
    </el-col>

  </el-row>
</template>

<script>
import {copyObj} from "@/assets/js/utils";
import {titleStyle} from "@/assets/js/colorMap";

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
      let tid = 'https://bbs.nga.cn/read.php?tid=';
      let fid = 'https://bbs.nga.cn/thread.php?fid=';
      let parent = this.data.parent;
      if (parent && parent["2"] === '版面镜像') {
        return fid + this.data["topic_misc_var"]["3"]
      }
      return tid + this.data.tid;
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