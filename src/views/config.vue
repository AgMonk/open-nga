<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main>
      <el-form label-width="150px">
        <el-form-item label="界面色调">
          <el-select v-model="config.uiColor" @change="$store.commit(`config/save`)">
            <el-option v-for="(item,i) in options.uiColor" :key="i" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align: left">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item name="使用提示">
            <template #title>
              <h4>使用提示</h4>
            </template>
            <ul>
              <li>主题内左键点击楼层号可以复制该回复/主题的官方链接，右键点击则直接打开该链接</li>
              <li>版面列表和主题内 快捷键 r 可以刷新当前页</li>
              <li>版面列表和主题内 快捷键a d 可以左右翻页 ,主题内 q 可以退回到当前版面的第一页</li>
              <li>主题内 w s可以在当前页跳转楼层 加shift则分别为跳转到第一个和最后一个回复</li>
              <li>每一页的回复在3分钟内再次访问时会使用缓存内的数据(不是实时状态)，强制刷新请点击刷新按钮或快捷键</li>
            </ul>
          </el-collapse-item>
          <el-collapse-item name="表情快速输入">
            <template #title>
              <h4>使用表情快速输入提示</h4>
            </template>
            <ul>
              <li>表情名称： 官方表情代码 [s:ac:哭笑] 中的“哭笑”二字称为表情名称</li>
              <li>当在正文输入框中输入 “空格 表情名称 空格” 时，程序会尝试按照中间的表情名称搜索对应的官方表情</li>
              <li>如果有且仅搜索到一个表情，则会将刚才输入的内容替换为对应的表情代码</li>
              <li>如输入：" 哭笑 " 会被替换为 [s:ac:哭笑]</li>
              <li>如果搜索到多个表情，暂不做响应</li>
            </ul>
          </el-collapse-item>
          <el-collapse-item name="附件上传(暂时仅支持图片)">
            <template #title>
              <h4>附件上传(暂时仅支持图片)</h4>
            </template>
            <ul>
              <li>选择图片上传完毕后 点放大镜可预览，点加号插入代码到光标位置，点垃圾桶删除附件</li>
              <li>对之前一次编辑上传好的附件 点图片可预览，其他相同</li>
              <li>删除附件后会连带删除正文中引用该附件的代码</li>
            </ul>
          </el-collapse-item>
          <el-collapse-item name="bbsCode快速输入">
            <template #title>
              <h4>bbsCode快速输入</h4>
            </template>
            <ul>
              <li>触发方式与"表情快速输入"相同</li>
              <li>如输入：" 折叠：折叠标题 " 会被替换为 [collapse=折叠标题][/collapse]</li>
              <li>如输入：" 折叠 " 会被替换为 [collapse][/collapse]</li>
              <li>标签名称和冒号中英文均可</li>
            </ul>
            <h5>标签名称的中英文对照</h5>
            <el-table :data="bbsCodeLibrary">
              <el-table-column label="标签名（中)" prop="name.cn" />
              <el-table-column label="标签名（英)" prop="name.en"/>
              <el-table-column label="别名" prop="name.en">
                <template #default="s">
                  {{s.row.name.short?s.row.name.short.join(" , "):`` }}
                </template>
              </el-table-column>
            </el-table>
            <h5>颜色名称的中英文对照</h5>
            <el-table :data="bbsCodeLibrary[0].props">
              <el-table-column label="颜色名（中)" prop="cn" />
              <el-table-column label="颜色名（英)" prop="en"/>
            </el-table>

          </el-collapse-item>

           <el-collapse-item name="空折叠">
            <template #title>
              <h4>空折叠</h4>
            </template>
            <ul>
              <li>说明文字</li>
            </ul>
          </el-collapse-item>


        </el-collapse>

      </div>
    </el-main>
    <el-footer>
    </el-footer>
  </el-container>

</template>

<script>
import {mapState} from "vuex";
import "../assets/css/ui-color.css"
import {bbsCodeLibrary} from "@/assets/js/bbscode";

export default {
  name: "config",
  data() {
    return {
      myData: {},
      bbsCodeLibrary,
      activeName: "",
    }
  },
  methods: {},
  computed: {
    ...mapState({
      config: state => state.config.config,
      options: state => state.config.options,
    })
  },
  mounted() {
  },
  watch: {},
  props: ["data"],
}

</script>

<style scoped>

</style>