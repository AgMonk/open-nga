<template>
  <div v-if="show">
    <el-link
        :href="url" target="_blank">
      <el-avatar
          :size="150" :src="url"
          fit="scale-down" shape="square"
          @error="error"
      />
    </el-link>
  </div>
</template>

<script>
import {mapState} from "vuex"

export default {
  name: "my-avatar",
  data() {
    return {
      proxy: "https://images.weserv.nl/?url=",
      show: false,
      index: 0,
      url: "",
    }
  },
  computed: {
    ...mapState({
      users: state => state.account.users
    })
  },
  methods: {
    error(e) {
      let imgCnUrl = "img.nga.cn"
      let img178Url = "img.nga.178.com"
      console.warn("头像载入失败: "+this.url)
      if (this.url.includes(imgCnUrl)) {
        this.url = this.url
            .replace(imgCnUrl,img178Url)
        console.log("尝试换源:"+ this.url)
      } else if (this.url.includes(this.proxy)) {
        this.url = this.url
            .replace(this.proxy,"https://")
        console.log("尝试直连:"+ this.url)
      } else{
        this.show = false;
      }
    },
    copy(uid) {
      this.show = false;
      if (this.users[uid]) {
        let avatars = this.users[uid].avatars;
        if (avatars && avatars.length > 0) {

          this.index = Math.floor((Math.random() * avatars.length - 1) + 1);
          if (!avatars[this.index].includes(this.proxy)) {
            this.url = avatars[this.index]
                .replace("https://", this.proxy)
                .replace("http://", this.proxy)
          }
          this.show = true;
        }
      }
    }
  },
  mounted() {
    this.copy(this.uid)
  },
  watch: {
    "uid": {
      handler: function (e) {
        this.copy(e)
      }
    },
  },
  props: ["uid"],
}

</script>

<style scoped>

</style>