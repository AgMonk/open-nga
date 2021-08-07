<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <template v-for="(code,i) in bbsCodeLibrary" :key="i">
        <el-select v-if="code.props" v-model="selection[code.name.en]" :placeholder="code.name.cn"
                   size="mini" style="width:100px;margin-left: 2px"
                   @change="selectionChanged(code.name.en,$event)"
        >
          <el-option v-for="(option,j) in code.props" :key="j" :label="option.cn" :value="option.en"/>
        </el-select>
        <el-tag v-else size="mini" style="cursor: pointer;margin-left: 2px" @click="addTag(code.name.en)">{{ code.name.cn }}
        </el-tag>
      </template>
      <el-button size="mini" type="primary" @click="visible.emotes =true">表情</el-button>
    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main style="padding: 0">
      <el-switch v-model="preview" active-text="预览" style="margin-right: 10px"/>
      <el-switch v-model="comment" active-text="评论" style="margin-right: 10px" @change="myParams.comment = ($event?1:undefined)"/>
      <br>
      <br>
      <el-input v-model="myParams.post_subject" placeholder="标题" style="margin-bottom: 5px"/>


      <el-card v-if="myParams.post_content&&preview" class="box-card" shadow="always" >
        <div style="text-align: left">
          <content-render :content="myParams.post_content"/>
        </div>
      </el-card>

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
      <el-dialog v-model="visible.emotes" title="表情" width="90%">
        <el-tabs v-model="activeTabName">
          <el-tab-pane v-for="(group,i) in emotesLibrary.emotes" :key="i" :label="group.name" :name="group.name"
                       style="text-align: left"
          >
            <img v-for="(img,j) in group.data" :key="j" :src="getEmoteUrl(group.namespace,j)"
                 @click="addText({startText:getBbsCode(group.namespace,j)});visible.emotes=false"
                 style="margin-left: 3px;cursor: pointer"
            />
          </el-tab-pane>
        </el-tabs>
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
import {copyObj, insertTextToTextarea} from "@/assets/js/utils";
import {emotesLibrary, getBbsCode, getEmoteUrl, searchEmotes} from "@/assets/js/emote";
import {bbsCodeLibrary, searchBbsCode} from "@/assets/js/bbscode";
import "@/assets/js/emote_customize"
import ContentRender from "@/components/content-render";

export default {
  name: "reply-text-area",
  components: {ContentRender, MyRouterLink},
  data() {
    return {
      visible: {
        emotes: false,
      },
      emotesLibrary,
      activeTabName: emotesLibrary.emotes[0].name,
      selection: {},
      bbsCodeLibrary,
      dialogShow: false,
      comment: false,
      preview: false,
      callbackUrls: [],
      myParams: {
        post_content: "",
        post_subject: "",
      },
    }
  },
  methods: {
    getEmoteUrl,
    getBbsCode,
    addTag(code) {
      let startText = "[" + code + "]"
      let endText = code === '*' ? '' : "[/" + code + "]";
      this.addText({startText, endText})
    },
    selectionChanged(code, e) {
      let startText = "[" + code + "=" + e + "]"
      let endText = "[/" + code + "]"
      this.addText({startText, endText})
      this.selection[code] = undefined;
    },
    delText(text) {
      this.myParams.post_content = this.myParams.post_content.replace(text, "")
      document.getElementById("textarea").focus()
    },
    addText({startText, endText, startPosition, endPosition, innerText}) {
      let textarea = document.getElementById("textarea");
      insertTextToTextarea(textarea
          , {startText, endText, startPosition, endPosition, innerText})
      this.myParams.post_content = textarea.value;
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
          console.log(res)
          // 尝试搜索表情名称
          let emotes = searchEmotes(res[1]);
          if (emotes.length > 1) {
            /* todo 有多个备选表情项 暂不处理 */
            e.returnValue = false;
          }
          if (emotes.length === 1) {
            //  只有一个备选项 直接替换
            let startText = emotes[0].code
            let startPosition = res.index;
            this.addText({startText, startPosition, innerText: false})
            e.returnValue = false;
          }

          /* todo 尝试搜索论坛code */

          let bbsCodes = searchBbsCode(res[1])
          if (bbsCodes.length === 1) {
            let code = bbsCodes[0]
            let startPosition = res.index;
            this.addText(Object.assign({}, code, {startPosition, innerText: false}))

            e.returnValue = false;
          }


        }

      } else if (!isNaN(index) && this.callbackUrls[index - 1]) {
        // 数字键 选择跳转目标
        e.returnValue = false;
        this.dialogShow = false;
        this.$router.push(this.callbackUrls[index - 1].route)
        this.callbackUrls = [];
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
          // console.log(content)

        if (content && content.length > 0) {
          this.myParams.post_content = content;
        }
        if (subject && subject.length > 0) {
          this.myParams.post_subject = subject;
        }

      }
    },

  },
  props: ["params", "focus"],
}

</script>

<style scoped>

</style>