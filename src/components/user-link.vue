<template>
 <span v-if="username">
   <span v-if="username.startsWith('#anony_')">匿名用户_{{username.split("_")[1].substring(0,5)}}</span>
   <my-router-link v-if="!username.startsWith('#anony_')"
                   :params="[id]" :text="$store.state.account.users[id].username" router="account" />
 </span>
</template>

<script>
import MyRouterLink from "@/components/my-router-link";

export default {
  name: "user-link",
  components: {MyRouterLink},
  data() {
    return {
      myData: {}
    }
  },
  methods: {
  },
  mounted() {
  },
  watch: {
  },
  props: ["id","username"],
}

</script>

<style scoped>

</style>