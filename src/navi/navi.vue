<template>
  <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" v-if="show">
    <el-menu-item v-for="(item,i) in navi" :key="i" :index="item.path">{{ item.title }}</el-menu-item>

  </el-menu>
</template>

<script>
import {getCookie} from "@/assets/js/cookieUtils";
import {getCache} from "@/assets/js/storageUtils";

export default {
  name: "navi",
  data() {
    return {
      show: true,
      activeIndex: "0",
      navi: [
        {path: "/forum", title: '版面'},
        {path: "/thread", title: '帖子'},
        {path: "/account", title: '用户中心'},
      ],
    }
  },
  methods: {
    handleSelect(e) {
      // console.log(e)
      if (e === '/account') {
        this.navi[2].path = "/account/" + getCookie("ngaPassportUid");
        this.$router.push(this.navi[2].path)
        this.refreshNavi()
      } else if (e.startsWith('/thread')) {
        let fid = this.$store.state.thread.fid;
        let page = this.$store.state.thread.page;
        if (fid === 0 && page === 0) {
          this.$message.error("尚未浏览过版面")
          return false
        } else {
          this.navi[1].path = "/thread/" + fid + "/" + page;
          this.$router.push(this.navi[1].path)
          this.refreshNavi()
        }
      } else  {
        this.$router.push(e)
      }
    },
    refreshNavi() {
      this.show = false;
      this.$nextTick(() => this.show = true)
    },
  },
  mounted() {
    this.$store.dispatch("forum/getFavForum")

    this.navi[this.navi.length - 1].params = getCookie("ngaPassportUid")
  }
}

</script>

<style scoped>

</style>