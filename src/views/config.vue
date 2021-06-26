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
          <li>主题内 快捷键a d 可以左右翻页 q 可以退回到当前版面的第一页</li>
          <li>w s可以在当前页跳转楼层 加shift则分别为跳转到第一个和最后一个回复 </li>
          <li>每一页的回复在3分钟内再次访问时会使用缓存内的数据(不是实时状态)，强制刷新请点击刷新按钮或快捷键</li>
        </ul>
        <h4>表情快速输入</h4>
        <ul>
          <li>表情名称： 官方表情代码 [s:ac:哭笑] 中的“哭笑”二字称为表情名称</li>
          <li>当在正文输入框中输入 “空格 表情名称 空格” 时，程序会尝试按照中间的表情名称搜索对应的官方表情</li>
          <li>如果有且仅搜索到一个表情，则会将刚才输入的内容替换为对应的表情代码</li>
          <li>如输入：" 哭笑 " 会被替换为 [s:ac:哭笑]</li>
          <li>如果搜索到多个表情，暂不做响应</li>
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