<template>
  <el-card :body-style="{ padding: '10px'}" :class="'box-card '+'black'+index%2">
    <template #header>
      <user-link :id="myData.uid" :username="myData.username"/>
      <my-avatar :uid="myData.uid" />
    </template>
    <el-form :inline="true">
      <el-form-item label="威望">
        <el-tag v-if="$store.state.account.users[myData.uid]" size="small">{{
            $store.state.account.users[myData.uid].rvrc / 10
          }}
        </el-tag>
      </el-form-item>
      <el-form-item label="总赞数">
        <el-tag v-if="$store.state.account.users[myData.uid]" size="small">{{
            $store.state.account.users[myData.uid].totalApproval
          }}
        </el-tag>
      </el-form-item>
      <el-form-item label="声望">
        <el-tag v-if="myData.reputation" size="small">{{ myData.reputation.name }}({{ myData.reputation.value }})</el-tag>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {copyObj} from "@/assets/js/utils";
import UserLink from "@/components/user-link";
import "../assets/css/ui-color.css"
import MyAvatar from "@/components/my-avatar";

export default {
  name: "reply-user-card",
  components: {MyAvatar, UserLink},
  data() {
    return {
      myData: {}

    }
  },
  methods: {
    avatarError(e) {
      console.log(e)
    },
    copy(obj) {
      this.myData = obj ? copyObj(obj) : [];
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
  props: ["data", "index"],
}

</script>

<style scoped>
</style>