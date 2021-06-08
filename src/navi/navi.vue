<template>
  <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
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
      activeIndex: "0",
      navi: [
        {path: "/forum", title: '版面'},
        {path: "/thread", title: '帖子'},
        {path: "/account", params: this.uid, title: '用户中心'},
      ],
    }
  },
  methods: {
    handleSelect(e) {
      // console.log(e)
      if (e === '/account') {
        this.$router.push('/account/' + getCookie("ngaPassportUid"))
      } else if (e.startsWith('/thread')) {
        let fid = this.$store.state.thread.fid;
        let page = this.$store.state.thread.page;
        this.$router.push(e + "/" + fid + "/" + page)
      } else {
        this.$router.push(e)
      }
    }
  },
  mounted() {
    this.$store.dispatch("forum/getFavForum")

    this.navi[this.navi.length - 1].params = getCookie("ngaPassportUid")
  }
}

</script>

<style scoped>

</style>