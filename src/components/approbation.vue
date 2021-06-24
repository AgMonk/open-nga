<!--赞踩显示和操作-->

<template>
  <el-tag class="miniTag" size="mini">
    <i class="el-icon-success click-able" @click="topicRecommend(tid,pid,1)"/>
    {{ myScore }}
    <i class="el-icon-error click-able" @click="topicRecommend(tid,pid,-1)"/>
  </el-tag>

</template>

<script>
import {topicRecommend} from "@/assets/js/api/api";

export default {
  name: "approbation",
  data() {
    return {
      myScore:this.score
    }
  },
  methods: {
    topicRecommend(tid, pid, value) {
      topicRecommend(tid, pid, value).then(res => {
        this.$message.success(res.message)
        this.myScore += res.value
      })
    },
  },
  mounted() {
  },
  props: ["tid","pid","score"],
}

</script>

<style scoped>
.miniTag {
  margin-left: 3px;
}

.click-able {
  cursor: pointer;
}
</style>