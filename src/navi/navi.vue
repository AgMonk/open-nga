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
import {getCookie, getCookieMap} from "@/assets/js/cookieUtils";

export default {
  name: "navi",
  data() {
    return {}
  },
  methods: {
    handleSelect(e) {
      if (e === "/thread") {
      }
      console.log(e)
    },
    refreshNavi() {
      this.$store.commit("navi/updatePath")
      this.$store.commit("navi/setShow")
      this.$nextTick(() => this.$store.commit("navi/setShow"))
    },
  },
  watch: {
    "$route": {
      handler: function (r) {
        let params = r.path.split("/")
        if (params[1] !== 'account') {
          this.$store.commit("navi/setParams", {
            key: params[1],
            params: params.splice(2, params.length - 2),
          })
          this.refreshNavi()
        }
      }
    }
  },
  mounted() {
    this.$store.commit("config/load")

    this.$store.dispatch("forum/getFavForum")
    console.log(getCookieMap())

    let uid = getCookie("ngaPassportUid");
    uid = uid?uid:0;
    this.$store.commit("navi/setParams", {
      key: "account",
      params: [uid]
    })
    this.refreshNavi()

  }
}

</script>

<style scoped>

</style>