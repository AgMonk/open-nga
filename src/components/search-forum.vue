<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-row>
          <el-input v-model="keyword" ref="mark" @change="search"/>
      </el-row>
    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
      <el-table :data="forums" @row-click="clickForum">
        <el-table-column label="版面" prop="name" />
      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {searchForum} from "@/assets/js/api/api";

export default {
  name: "search-forum",
  data() {
    return {
      keyword: "",
      forums:[],
    }
  },
  methods: {
    clickForum(row, column, event){
      if (confirm("确认收藏版面 " + row.name)) {
        this.$emit("add-fav", row.fid)
      }
    },
    search(){
      searchForum(this.keyword).then(res=>{
        this.forums = res.data

        console.log(this.forums)
      })
    },
  },
  mounted() {
    this.$refs['mark'].focus()
  },

}

</script>

<style scoped>

</style>