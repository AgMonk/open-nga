<template>
 <span v-if="username">
   <span v-if="username.startsWith('#anony_')">匿名用户</span>
   <router-link v-if="!username.startsWith('#anony_')" :to="'/account/'+id" style="text-decoration: none">
     <el-link :href="'/account/'+id">{{$store.state.account.users[id].username}}</el-link>
<!--     <el-link :href="'/account/'+id">{{username}}</el-link>-->
   </router-link>
 </span>
</template>

<script>
export default {
  name: "user-link",
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