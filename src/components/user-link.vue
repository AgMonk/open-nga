<template>
 <span v-if="username">
   <span v-if="username.toString().startsWith('#anony_')">匿名用户_{{ username.split("_")[1].substring(0, 8) }}</span>
   <my-router-link
       v-if="!username.toString().startsWith('#anony_')"
       :params="[id]" :text="(username&&username.length>0)?username:users[id].username"
       router="account"
       :text-style="{color: '#77878f'}"
   />
 </span>
</template>

<script>
import MyRouterLink from "@/components/my-router-link";
import {mapState} from "vuex";

export default {
  name: "user-link",
  components: {MyRouterLink},
  data() {
    return {
      myData: {}
    }
  },
  methods: {},
  mounted() {
  },
  computed: {
    ...mapState({
      users: state => state.account.users,
    })
  },
  watch: {},
  props: ["id", "username"],
}

</script>

<style scoped>

</style>