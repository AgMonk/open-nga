<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button v-if="uid" type="primary" @click="uid=undefined">添加账号</el-button>
      <el-select  placeholder="切换账号" v-model="selected" type="primary" @change="changeAccount">
        <el-option v-for="(value,key) in accounts" :value="key" :label="key"/>
      </el-select>
      <el-select  placeholder="移除账号" v-model="selected" type="primary" @change="delAccount">
        <el-option v-for="(value,key) in accounts" :value="key" :label="key"/>
      </el-select>

    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
      <div v-if="!uid">
        <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入Cookie"
            v-model="cookie"/>
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button type="primary" @click="uid=getUid()">返回</el-button>
      </div>
      <user-info :uid="$route.params.uid" v-if="uid"/>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {getCookie, setCookies} from "@/assets/js/cookieUtils";
import Money from "@/components/money";
import UserInfo from "@/components/user-info";
import {delCache, getCacheByPrefix} from "@/assets/js/storageUtils";
import {searchForum} from "@/assets/js/api/forum";

export default {
  name: "account",
  components: {UserInfo, Money},
  data() {
    return {
      show: false,
      cookie: undefined,
      selected: undefined,
      uid: this.getUid(),
      accounts: {}
    }
  },
  methods: {
    refreshNavi() {
      this.$store.commit("navi/updatePath")
      this.$store.commit("navi/setShow")
      this.$nextTick(() => this.$store.commit("navi/setShow"))
    },
    getUid() {
      return getCookie("ngaPassportUid");
    },
    delAccount(key){
      let cookie = this.accounts[key];
      let accountKey = "account "+cookie.username
      delCache(accountKey)
      this.selected = undefined
    },
    changeAccount(key) {
      let cookie = this.accounts[key];
      this.$store.dispatch("account/loginWithCookie", cookie).then(res => {
        this.$router.push("/account/" + this.getUid());
        this.$store.dispatch("forum/getFavForum")

      //  更新导航栏
        this.$store.commit("navi/setParams",{
          key:"account",
          params:[getCookie("ngaPassportUid")]
        })
        this.refreshNavi();
      })
      this.selected = undefined
    },
    login() {
      setCookies(this.cookie)
      this.$store.dispatch("account/loginWithCookie", this.cookie).then(res => {
        this.$router.push("/account/" + this.getUid());
      })
    }
  },
  watch: {},
  mounted() {
    this.accounts = getCacheByPrefix("account");

  },
}

</script>

<style scoped>

</style>