<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
      <el-form label-width="150px">
        <el-form-item label="界面色调">
          <el-select v-model="config.uiColor" @change="$store.commit(`config/save`)">
            <el-option v-for="(item,i) in options.uiColor" :key="i" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align: left">
        <h4>使用提示</h4>
        <ul>
          <li>主题内左键点击楼层号可以复制该回复/主题的官方链接，右键点击则直接打开该链接</li>
          <li>版面列表和主题内 快捷键 r 可以刷新当前页</li>
          <li>主题内 快捷键a d 可以左右翻页 w s可以在当前页跳转楼层 q 可以退回到当前版面的第一页</li>
          <li>每一页的回复在3分钟内再次访问时会使用缓存内的数据(不是实时状态)，强制刷新请点击刷新按钮或快捷键 r</li>
        </ul>
      </div>
    </el-main>
    <el-footer>
    </el-footer>
  </el-container>

</template>

<script>
import {mapState} from "vuex";
import "../assets/css/ui-color.css"

export default {
  name: "config",
  data() {
    return {
      myData: {}
    }
  },
  methods: {
  },
  computed: {
    ...mapState({
      config: state => state.config.config,
      options: state => state.config.options,
    })
  },
  mounted() {
  },
  watch: {
  },
  props: ["data"],
}

</script>

<style scoped>

</style>