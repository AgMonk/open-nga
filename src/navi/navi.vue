<template>
  <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="$router.push"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" v-if="$store.state.navi.show">
    <el-menu-item v-for="(navi,key) in $store.state.navi.navigators" :key="key" :index="navi.path">{{ navi.title }}</el-menu-item>
<!--    <el-menu-item v-for="(item,i) in navi" :key="i" :index="item.path">{{ item.title }}</el-menu-item>-->

  </el-menu>
</template>

<script>
import {getCookie} from "@/assets/js/cookieUtils";
import {getCache} from "@/assets/js/storageUtils";

export default {
  name: "navi",
  data() {
    return {
    }
  },
  methods: {
    handleSelect(e) {
      if (e === "/thread") {
      }
      console.log(e)
    },
    refreshNavi() {
      this.$store.commit("navi/setShow")
      this.$nextTick(() => this.$store.commit("navi/setShow"))
    },
  },
  mounted() {
    this.$store.dispatch("forum/getFavForum")
  }
}

</script>

<style scoped>

</style>