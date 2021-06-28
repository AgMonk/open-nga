<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <!--suppress HtmlUnknownTag -->
    <el-main style="padding: 0">
      <el-input v-model="myParams.post_subject" placeholder="标题" style="margin-bottom: 5px"/>
      <el-input id="textarea"
                ref="reply-text-area"
                v-model="myParams.post_content"
                :rows="!myParams.post_content?5:Math.max(myParams.post_content.split(`\n`).length+1,5)" placeholder="正文"
                style="margin-bottom: 5px"
                type="textarea"
                @keypress="keypress"
      />
      <el-dialog v-model="dialogShow" title="跳转目标">
        <div v-for="(item,i) in callbackUrls" :key="i">
          <my-router-link :text="item.text" :url="item.route" @click="dialogShow=false"/>
          ( {{ i + 1 }} )
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
import {searchEmotes} from "@/assets/js/emote";

export default {
  name: "reply-text-area",
  components: {MyRouterLink},
  data() {
    return {
      dialogShow: false,
      callbackUrls: [],
      myParams: {
        post_content: "",
        post_subject: "",
      },
    }
  },
  methods: {
    addText(text) {
      let textarea = document.getElementById("textarea")
      let t1 = this.myParams.post_content.substring(0, textarea.selectionStart);
      let t2 = this.myParams.post_content.substring(textarea.selectionEnd);
      this.myParams.post_content = t1 + text + t2;
    },
    keypress(e) {
      console.log(e)
      let index = e.key;
      if (e.code === 'Enter' && e.ctrlKey) {
        this.submit()
      }
      if (e.code === 'Space') {
        // 快速表情功能
        let textarea = document.getElementById("textarea")
        let reg = /\s([^\s]+?)$/g;
        let tempString = this.myParams.post_content.substring(0, textarea.selectionStart)
        // console.log(tempString)
        let res = reg.exec(tempString)
        if (res) {
          // console.log(res)
          let emotes = searchEmotes(res[1]);
          if (emotes.length > 1) {
            /* todo 有多个备选表情项 暂不处理 */
            e.returnValue = false;
          }
          if (emotes.length === 1) {
            //  只有一个备选项 直接替换
            let newString;
            let emote = emotes[0]
            // 根据是否为官方表情 决定替换的字符串格式
            if (emote.official) {
              newString = emote.code
            } else {
              newString = "[img]" + emote.url + "[/img]"
            }
            this.myParams.post_content =
                tempString.substring(0, res.index)
                + newString
                + this.myParams.post_content.substring(textarea.selectionStart);
            e.returnValue = false;
          }

        }

      } else if (!isNaN(index) && this.callbackUrls[index - 1]) {
        // 数字键 选择跳转目标
        e.returnValue = false;
        this.dialogShow = false;
        this.$router.push(this.callbackUrls[index - 1].route)
      } else {
        console.log(index)
      }
    },
    submit() {
      console.log(this.myParams)
      doPost(this.myParams).then(res => {
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
        this.myParams.post_content = "";
      })
    },
  },
  mounted() {
    if (this.focus) {
      this.$refs['reply-text-area'].focus()
    }

    this.myParams = copyObj(this.params)
  },
  watch: {
    "params": {
      handler: function (e) {
        let content = this.myParams.post_content;
        let subject = this.myParams.post_subject;

        this.myParams = copyObj(e)

        if (content && content.length > 0) {
          this.myParams.post_content = content;
        }
        if (subject && subject.length > 0) {
          this.myParams.post_subject = subject;
        }

        console.log(e)
      }
    },

  },
  props: ["params", "focus"],
}

</script>

<style scoped>

</style>