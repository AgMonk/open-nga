<!--版面-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="visible.search=true">搜索版面</el-button>
      <el-button type="primary" @click="refreshFavForum">刷新</el-button>

    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
      <el-table :cell-class-name="cellClassName" :cell-style="{cursor: 'pointer'}" :data="forums"
                @cell-click="clickForum">
        <el-table-column label="版面" prop="name"/>
        <el-table-column label="移除" width="100px">
          <template #default="s">
            <el-button size="mini" type="danger" @click="delFavForum(s)">移除</el-button>
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
import SearchForum from "@/components/search-forum";
import "../assets/css/ui-color.css"
import {mapState} from "vuex";

export default {
  name: "forum",
  components: {SearchForum},
  data() {
    return {
      namespace: "favForums",
      favForums: [],
      visible: {
        search: false,
      }
    }
  },
  computed: {
    ...mapState({
      forums: state => state.forum.forums,
    })
  },
  methods: {
    cellClassName({rowIndex}) {
      return this.$store.state.config.config.uiColor + rowIndex % 2
    },
    clickForum(row, column) {
      if (column.property === 'name') {
        this.$router.push("/thread/" + row.fid + "/1")
      }
    },
    addFavForum(fid) {
      this.$store.dispatch("forum/addFavForum", fid).then(() => {
        this.visible.search = false
      })
    },
    delFavForum(e) {
      if (confirm("移除收藏版面 " + e.row.name)) {
        this.$store.dispatch("forum/delFavForum", e.row.fid)
      }
    },
    refreshFavForum() {
      this.$store.dispatch("forum/getFavForum").then(() => {
        this.$message.success("刷新成功")
      })
    }
  },
  mounted() {
    this.$store.dispatch("forum/getFavForum")
  },
}

</script>

<style scoped>

</style>