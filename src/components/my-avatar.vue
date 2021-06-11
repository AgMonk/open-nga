<template>
  <div v-if="users[uid] && urls.length>0">
    <el-link
        :href="urls[index]" target="_blank">
      <el-avatar
          :size="150" :src="urls[index]"
          fit="scale-down" shape="square"
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
      urls: [],
      index:0,
    }
  },
  computed: {
    ...mapState({
      users: state => state.account.users
    })
  },
  methods: {
    copy(uid) {
      if (this.users[uid]) {
        let avatar = this.users[uid].avatar;
        if (avatar && avatar.length > 0) {
          this.urls = [];

          let urls = avatar.split("|")
              // .map(a => a.substring(0, a.indexOf("?")))
              .map(a => a.replace(".a", ""))
              // .map(a => a.replace("https", "http"))

          this.urls.push(urls[0])
          let a = urls[0].split("/");
          for (let i = 1; i < urls.length; i++) {
            a[a.length-1] = urls[i];
            this.urls.push(a.join("/"))
          }

          this.index = Math.floor((Math.random()*this.urls.length-1)+1);
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
    "$store.state.account.users[uid]": {
      handler: function (e) {
        console.log(e)
      }
    }
  },
  props: ["uid"],
}

</script>

<style scoped>

</style>