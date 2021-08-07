<template>
  <div>
    <el-menu
        v-if="$store.state.navi.show"
        :default-active="$route.path"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-demo"
        mode="horizontal"
        text-color="#fff" @select="$router.push">
<!--      <el-menu-item v-for="(navi,key) in $store.state.navi.navigators" :key="key" :index="navi.path">{{-->
<!--          navi.title-->
<!--        }}-->
<!--      </el-menu-item>-->
<!--      &lt;!&ndash;    <el-menu-item v-for="(item,i) in navi" :key="i" :index="item.path">{{ item.title }}</el-menu-item>&ndash;&gt;-->
<!--      <el-submenu>-->
<!--        <template #title>我的</template>-->
<!--        <el-menu-item index="/thread/favor/1" >收藏</el-menu-item>-->
<!--      </el-submenu>-->
      <my-navigation-item v-for="(navi,key) in $store.state.navi.navigators" :key="key" :index="navi.path" :parent-path="navi.path" :route="navi" />
    </el-menu>
    <h4 style="margin-top: 10px;margin-bottom: 10px">{{$route.name}}</h4>


  </div>
</template>

<script>
import {getCookie} from "@/assets/js/cookieUtils";
import MyNavigationItem from "@/navi/my-navigation-item";

export default {
  name: "navi",
  components: {MyNavigationItem},
  data() {
    return {}
  },
  methods: {
    handleSelect(e) {
      if (e === "/thread") {
      }
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