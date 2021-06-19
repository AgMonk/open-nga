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