<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header height="30px" style="padding: 0 10px">
      <el-row>
        <el-col :span="18" style="text-align: left">
          <el-tag
              v-clipboard:copy="myData.pid===0?'https://bbs.nga.cn/read.php?tid='+myData.tid:'https://bbs.nga.cn/read.php?pid='+myData.pid"
              v-clipboard:error="onError"
              v-clipboard:success="onCopy"
              class="miniTag click-able"
              size="mini"
              @click.right="openUrl(myData.pid===0?'https://bbs.nga.cn/read.php?tid='+myData.tid:'https://bbs.nga.cn/read.php?pid='+myData.pid)"
          >#{{ myData.lou }}
          </el-tag>
          <approbation :pid="myData.pid" :score="myData.score" :tid="tid"/>
          <el-tag class="miniTag click-able" size="mini" @click="$router.push(`/read/`+myData.pid)">{{ myData.postdate }}</el-tag>
          <el-tag v-if="myData.lastEdit" class="miniTag" size="mini">最后编辑:{{ myData.lastEdit }}</el-tag>
          <el-tag v-if="myData.reply_to" class="miniTag click-able" size="mini" type="warning"
                  @click="$router.push(`/read/`+myData.reply_to)">回复目标
          </el-tag>
          <my-mini-tag v-if="myData.typeOfReply&&myData.typeOfReply.freeEdit" text="可编辑"/>
<!--          <my-mini-tag v-if="myData.typeOfReply&&myData.typeOfReply.hasUpload" text="有附件"/>-->
          <my-mini-tag v-if="myData.typeOfReply&&myData.typeOfReply.hidden" text="隐藏" type="danger"/>
          <my-mini-tag v-if="myData.typeOfReply&&myData.typeOfReply.locked" text="锁定" type="danger"/>
          <my-mini-tag v-if="myData.typeOfReply&&myData.typeOfReply.notVerified" text="审核不通过" type="danger"/>
          <my-mini-tag v-if="myData.typeOfReply&&myData.typeOfReply.verifying" text="审核中.." type="danger"/>
          <el-tag v-if="myData.comment_to_id" class="miniTag click-able" size="mini" type="warning"
                  @click="jump2CommentTarget">评论目标
          </el-tag>

        </el-col>
        <el-col :span="6" style="text-align: right">
          <my-mini-tag v-if="``+myData.authorid===getCookie(`ngaPassportUid`)" text="查审核" @click="checkStatus"/>
          <my-mini-tag :route="[`post`,`quote`, myData.fid, myData.tid,myData.pid, 0]" text="引用"/>
          <my-mini-tag :route="[`post`,`reply`, myData.fid, myData.tid,myData.pid, 0]" text="回复"/>
          <content-popover :data="myData">
            <el-switch v-model="showCode" active-color="#13ce66" active-text="源代码" inactive-color="#ff4949"></el-switch>
          </content-popover>
        </el-col>

      </el-row>
    </el-header>
    <!--suppress HtmlUnknownTag -->
    <el-main style="padding: 10px;text-align: left">
      <div v-if="myData.subject">
        <h4>{{ myData.subject }}</h4>
      </div>
      <div v-show="showCode">
        {{ myData.content }}
      </div>
      <div v-show="!showCode">
        <content-render :content="myData.content">{{ myData.content }}</content-render>
      </div>
      <!--suppress JSUnresolvedVariable -->
      <!--热评-->
      <div v-if="myData.hotreply">
        <h4 style="color: red">热评区</h4>
        <!--suppress JSUnresolvedVariable -->
        <div v-for="(comment,i) in myData.hotreply" :key="i">
          <el-card class="box-card">
            <template #header>
              <user-link :id="comment.authorid" :username="users[comment.authorid]"/>
              <approbation :pid="comment.pid" :score="comment.score" :tid="comment.tid"/>
              <el-tag class="miniTag click-able" size="mini" @click="$router.push(`/read/`+comment.pid)">{{
                  comment.postdate
                }}
              </el-tag>
              <el-tag class="miniTag click-able" size="mini" @click="reply(`quote`,comment.pid)"><i
                  class="el-icon-chat-line-square"/>引用
              </el-tag>
              <el-tag class="miniTag click-able" size="mini" @click="reply(`reply`,comment.pid)"><i
                  class="el-icon-chat-line-round"/>回复
              </el-tag>
            </template>
            <content-render :content="comment.content">{{ comment.content }}</content-render>
          </el-card>
        </div>
      </div>


      <!--      评论贴条-->
      <div v-if="myData.comment">
        <h4>评论</h4>
        <div v-for="(comment,i) in myData.comment" :key="i">
          <el-card class="box-card">
            <template #header>
              <user-link :id="comment.authorid" :username="users[comment.authorid]"/>
              <approbation :pid="comment.pid" :score="comment.score" :tid="comment.tid"/>
              <el-tag class="miniTag click-able" size="mini" @click="$router.push(`/read/`+comment.pid)">{{
                  comment.postdate
                }}
              </el-tag>
              <el-tag class="miniTag click-able" size="mini" @click="reply(`quote`,comment.pid)"><i
                  class="el-icon-chat-line-square"/>引用
              </el-tag>
              <el-tag class="miniTag click-able" size="mini" @click="reply(`reply`,comment.pid)"><i
                  class="el-icon-chat-line-round"/>回复
              </el-tag>
            </template>
            <content-render :content="comment.content.replace(/\[b]Reply to .+?\[\/b]/,``)">{{ comment.content }}</content-render>
          </el-card>
        </div>
      </div>
      <div v-if="myData.attachs">
        <h4>附件</h4>
        <template v-for="(item,i) in myData.attachs" :key="i">
          <span v-if="item.type===`img`">
            <my-mini-tag text="图片"/>
            <el-link :href="`/img/`+item.attachurl" target="_blank">{{ item.url_utf8_org_name ? decodeURI(item.url_utf8_org_name) : item.name }}</el-link>
          </span>
          <span v-else-if="item.type===`zip`">
            <my-mini-tag text="压缩包"/>
            <el-link :href="`/img/${item.attachurl}`" target="_blank">{{ item.url_utf8_org_name ? decodeURI(item.url_utf8_org_name) : item.name }}</el-link>
          </span>
          <span v-else>{{ item }}</span>
        </template>
      </div>
    </el-main>
    <el-footer style="padding: 0 10px">
      <div v-if="myData.operationLog">
        <el-tag v-for="(item,i) in myData.operationLog" :key="i" :type="item.type==='禁言'?'danger':'primary'">
          {{ item.type }}{{ item.type === '禁言' ? item.days + '天' : '' }} 声望{{ item.reputation }} 威望{{ item.rvrc }}
          {{ item.reason }}
        </el-tag>
      </div>
    </el-footer>
  </el-container>

</template>

<script>
import {copyObj} from "@/assets/js/utils";
import {getRoute} from "@/assets/js/api/routerUtils";
import {topicRecommend} from "@/assets/js/api/api";
import ContentRender from "@/components/content-render";
import MyRouterLink from "@/components/my-router-link";
import UserLink from "@/components/user-link";
import {mapState} from "vuex";
import Approbation from "@/components/approbation";
import {preComment, prePost} from "@/assets/js/api/postApi";
import ContentPopover from "@/components/content-popover";
import MyMiniTag from "@/components/my-mini-tag";
import {getCookie} from "@/assets/js/cookieUtils";

export default {
  name: "reply-content-card",
  components: {MyMiniTag, ContentPopover, Approbation, UserLink, MyRouterLink, ContentRender},
  data() {
    return {
      myData: {},
      showCode: false,
    }
  },
  computed: {
    ...mapState({
      users: state => state.account.users,
    })
  },
  methods: {
    getCookie,
    jump2CommentTarget() {
      if (this.myData.comment_to_id > 0) {
        this.$router.push(`/read/` + this.myData.comment_to_id)
      } else {
        this.$router.push(getRoute(['read', this.tid, 1]))
      }
    },
    comment() {
      preComment(this.myData)
    },
    checkStatus() {
      const {fid, pid, tid} = this.myData
      prePost({fid, pid, tid, action: "quote"}).then(res => {
        const content = res.content;
        if (content.includes(`[quote]`)) {
          this.$message.success(`该回复已过审`)
        } else {
          this.$message.error(`该回复未过审或仍在审核中...`)
        }
      })
    },
    reply(action, pid) {
      this.$router.push(getRoute(["post", action
        , this.myData.fid ? this.myData.fid : 0
        , this.myData.tid ? this.myData.tid : this.tid
        , pid ? pid : this.myData.pid, 0]))
    },
    openUrl(url) {
      window.open(url)
    },
    threadOnly(v) {
      this.$router.push(getRoute(["thread", this.myData.fid, 1, this.myData.authorid, v]))
    },
    topicRecommend(tid, pid, value) {
      topicRecommend(tid, pid, value).then(res => {
        this.$message.success(res.message)
        this.myData.score += res.value
      })
    },
    onCopy() {
      this.$message.success("已复制回复地址")
    },
    onError(e) {
      this.$message.error("复制失败")
      console.log(e)
    },
    readOnly() {
      let tid = this.$route.params.tid;
      let authorid = this.myData.authorid;
      this.$router.push(getRoute(["read", tid, 1, authorid]))
    },
    copy(obj) {
      this.myData = obj ? copyObj(obj) : [];
      // console.log(JSON.stringify(parseBbsCode(this.myData.content)))
    }
  },
  mounted() {
    this.copy(this.data)
  },
  watch: {
    "data": {
      handler: function (e) {
        this.copy(e)
      }
    }
  },
  props: ["data", "tid"],
}

</script>

<style scoped>
.miniTag {
  margin-left: 3px;
}

.click-able {
  cursor: pointer;
}
</style>