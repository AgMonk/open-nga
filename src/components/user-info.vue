<template>

  <el-form :model="myData" label-width="80px"  v-if="show">
    <el-form-item label="用户名">{{ myData.username }}</el-form-item>
    <el-form-item label="用户ID">{{ myData.uid }}</el-form-item>
    <el-form-item label="威望">{{ myData.rvrc/10 }}</el-form-item>
    <el-form-item label="注册时间">{{ myData.regDate }}</el-form-item>
    <el-form-item label="用户组">{{ myData.group }}({{ myData.gid }})</el-form-item>
    <el-form-item label="金钱"><money :data="myData.money" /> </el-form-item>
<!--    <el-form-item label="金钱">{{myData.moneyString}}</el-form-item>-->
    <el-form-item label="总赞数">{{ myData.totalApproval}}</el-form-item>
    <el-form-item label="邮箱" v-if="myData.email">{{ myData.email }}</el-form-item>
    <el-form-item label="电话" v-if="myData.phone">{{ myData.phone }}</el-form-item>
    <el-form-item label="发帖数" v-if="myData.posts">{{ myData.posts }}</el-form-item>
  </el-form>

</template>

<script>
import Money from "@/components/money";
export default {
  name: "user-info",
  components: {Money},
  data() {
    return {
      show:false,
      myData: {}
    }
  },
  methods: {
    getUserInfo(uid) {
      this.show = false;
      // this.myData = this.$store
      let data = this.$store.state.account.users[uid]
      // console.log(data)
      if (!data) {
        this.$store.dispatch("account/userInfo", uid).then(res => {
          this.myData = res;
          this.show = true;
        })
      }else{
        this.myData = data;
        this.show = true;
      }
    }
  },
  mounted() {
    this.getUserInfo(this.uid)
  },
  watch: {
    "uid": {
      handler: function (uid) {
        this.getUserInfo(uid)
      }
    }
  },
  props: ["uid"],
}

</script>

<style scoped>

</style>