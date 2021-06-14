<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <!--suppress HtmlUnknownTag -->
    <el-main style="padding: 0">
      <el-input v-model="myParams.post_subject" placeholder="标题" style="margin-bottom: 5px"/>
      <el-input id="textarea"
                ref="reply-text-area"
                v-model="myContent"
                :rows="myContent.split(`\n`).length+1" placeholder="正文"
                style="margin-bottom: 5px"
                type="textarea"
                @keypress="keypress"
      />
      <el-dialog v-model="dialogShow" title="跳转目标">
        <div v-for="(item,i) in callbackUrls" :key="i" >
          <my-router-link :text="item.text" :url="item.route" @click="dialogShow=false"/>( {{i+1}} )
          <br/>
          <br/>
        </div>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-button type="success" @click="submit">提交( Ctrl+Enter )</el-button>
      <!--      <el-button type="danger" @click="reset">重置到默认</el-button>-->
    </el-footer>
  </el-container>

</template>

<script>
import {doPost} from "@/assets/js/api/postApi";
import {getRoute} from "@/assets/js/api/routerUtils";
import MyRouterLink from "@/components/my-router-link";
import {copyObj} from "@/assets/js/utils";

export default {
  name: "reply-text-area",
  components: {MyRouterLink},
  data() {
    return {
      dialogShow: false,
      callbackUrls: [],
      myContent:'',
      myParams: {},
    }
  },
  methods: {
    keypress(e) {
      if (e.code === 'Enter' && e.ctrlKey) {
        this.submit()
      }
      let index = e.key;
      if (!isNaN(index) &&this.callbackUrls[index-1]) {
        console.log(e)
        e.returnValue = false;
        this.dialogShow=false;
        this.$router.push(this.callbackUrls[index-1].route)
      }
    },
    submit() {
      console.log(this.myParams)
      doPost(this.myParams, this.myContent).then(res => {
        console.log(res)
        this.dialogShow = true;

        this.callbackUrls = [];
        this.callbackUrls.push({text: "回到版面", route: getRoute(["thread", res.fid, 1])})
        this.callbackUrls.push({text: "进入主题", route: getRoute(["read", res.tid, "e"])})
        if (res.pid) {
          this.callbackUrls.push({text: "我的回复", route: getRoute(["read", res.pid])})
        }

        this.$emit("submitted")
        this.myParams.post_subject = "";
        this.myContent="";
      })
    },
  },
  mounted() {
    if (this.focus) {
      this.$refs['reply-text-area'].focus()
    }

    this.myContent = copyObj(this.content)
    this.myParams = copyObj(this.params)
  },
  watch: {
    "content":{
      handler:function(e){
        this.myContent = copyObj(e)
      }
    },
    "params":{
      handler:function(e){
        this.myParams = copyObj(e)
      }
    },

  },
  props: ["content", "params","focus"],
}

</script>

<style scoped>

</style>