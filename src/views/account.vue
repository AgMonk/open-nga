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
import {getCookie} from "@/assets/js/cookieUtils";
import Money from "@/components/money";
import UserInfo from "@/components/user-info";
import {delCache, getCacheByPrefix} from "@/assets/js/storageUtils";
import account from "@/store/account";
import "../assets/css/ui-color.css"
import {mapActions} from "vuex";

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
    ...mapActions(`account`,[`loginWithCookie`]),
    getUid() {
      return getCookie("ngaPassportUid");
    },
    delAccount(key){
      let accountKey = "account "+key
      delCache(accountKey)
      delete this.accounts[key];
      this.selected = undefined
    },
    changeAccount(key) {
      let cookie = this.accounts[key];
      this.loginWithCookie(cookie).then(res => {
        this.$router.push("/account/" + this.getUid());
        this.$store.dispatch("forum/getFavForum")

        this.$router.push("/account/" + this.getUid());

      })
      this.selected = undefined
    },
    login() {
      this.loginWithCookie(this.cookie).then(res => {
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