<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item v-for="(item,i) in navi" :key="i" :index="''+i">{{ item.title }}</el-menu-item>

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
      let navi = this.navi[e];
      if (navi.path === '/account') {
        this.$router.push('/account/' + getCookie("ngaPassportUid"))
      } else if (navi.path === '/thread') {
        let forum = getCache("currentForum");
        this.$router.push(navi.path + "/" + forum.fid + "/" + forum.page)
      } else {
        this.$router.push(navi.path)
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