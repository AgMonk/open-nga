<!--版面-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="visible.search=true">搜索版面</el-button>

    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
      <el-table :data="favForums" @cell-click="clickForum">
        <el-table-column label="版面" prop="name"/>
        <el-table-column label="移除" width="100px">
          <template #default="s">
            <el-button type="danger" @click="rmFavForum(s)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer></el-footer>
    <el-dialog v-model="visible.search" width="70%">
      <search-forum v-if="visible.search" @add-fav="addFavForum"/>
    </el-dialog>
  </el-container>

</template>

<script>
import {getCache, putCache} from "@/assets/js/storageUtils";
import SearchForum from "@/components/search-forum";

export default {
  name: "forum",
  components: {SearchForum},
  data() {
    return {
      namespace: "favForums",
      favForums: [
        {fid: -547859, name: '测试版面'}
      ],
      visible: {
        search: false,
      }
    }
  },
  methods: {
    clickForum(row, column, cell, event) {
      if (column.property === 'name') {
        this.$router.push("/thread/" + row.fid)
      }
    },
    addFavForum({fid, name}) {
      this.visible.search = false;
      this.favForums.push({fid, name});
      putCache(this.namespace, this.favForums);
    },
    rmFavForum(e) {
      let index = e.$index;
      let name = e.row.name;
      if (confirm("移除收藏版面 " + name)) {
        this.favForums.splice(index,1);
        putCache(this.namespace, this.favForums);
      }
    },
  },
  mounted() {
    let forums = getCache(this.namespace);
    this.favForums = forums ? forums : [];
  },
}

</script>

<style scoped>

</style>