<template>
  <div class="home">
    <el-button>aaa</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {thread} from "@/assets/js/api/api";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted() {
    // console.log(this)
    // let s = "taihe_bi_sdk_uid=8570c3b82533bcbc955b64b85e5cc1b0; taihe=6175cb462f95c5ed0a4e7770d35c0369; UM_distinctid=178dd48b6092a9-021e09eb9856e9-c3f3568-1fa400-178dd48b60a2ad; UM_distinctid=1797d6bd7483ab-0a9cdb77e565ee-2363163-1fa400-1797d6bd74a331; ngacn0comUserInfo=%D7%F3%C7%A3%BB%C6%D3%D2%C7%DC%B2%D4\t%E5%B7%A6%E7%89%B5%E9%BB%84%E5%8F%B3%E6%93%92%E8%8B%8D\t39\t39\t\t14\t13948\t4\t0\t0\t61_1,102_90; ngaPassportUid=39841854; ngaPassportUrlencodedUname=%D7%F3%C7%A3%BB%C6%D3%D2%C7%DC%B2%D4; ngaPassportCid=X8piu7qso541t2vm5t6opbf5llghfob9qj581dh3; ngacn0comUserInfoCheck=6baa30c2a9d4e3fc964426972dd6a5e2; ngacn0comInfoCheckTime=1623034655; lastvisit=1623040158; lastpath=/read.php?tid=25968165; bbsmisccookies={\"uisetting\":{0:1048576,1:1625965798},\"pv_count_for_insad\":{0:-33,1:1623085290},\"insad_views\":{0:1,1:1623085290}}; CNZZDATA30043604=cnzz_eid=675084397-1594717559-https%3A%2F%2Fbbs.nga.cn%2F&ntime=1623035998; _cnzz_CV30043604=forum|fid-547859|0"
    // this.$store.dispatch("account/loginWithCookie",s)
    //  this.$store.dispatch("account/getLoginStatus").then(res=>{
    //    console.log(res)
    //  })
    // thread(-547859)
  }
}
</script>
