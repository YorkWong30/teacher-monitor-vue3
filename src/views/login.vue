<template>
  <div class="content">
    <div class="top" :style="{ backgroundImage: `url(${topBgUrl})` }"></div>

    <div class="x-f title-box">
      <div class="bold f30">
        <span class="c0">九划急症</span>
        <span class="black">医学模拟</span>
      </div>
      <div class="c1 f16 title-two">（老师端）</div>
    </div>

    <div class="the-form">
      <van-cell-group inset>
        <van-field v-model="username" label="账号" placeholder="请输入账号" />
        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
        />
        <van-field v-model="deviceId" label="设备Id" placeholder="设备Id" />
      </van-cell-group>
    </div>

    <div class="the-button x-c">
      <van-button
        :disabled="username == '' || password == '' || deviceId == ''"
        type="primary"
        size="small"
        :loading="loading"
        loading-text="登录中..."
        style="width: 300px"
        @click="doLogin"
        >登 录</van-button
      >
    </div>
  </div>
</template>
<script setup>
import { showSuccessToast, showFailToast } from "vant";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { getCurrentInstance, ref, watch } from "vue";
const { proxy } = getCurrentInstance();

import useUserStore from "@/store/modules/user";
const userStore = useUserStore();

const topBgUrl = proxy.imageUrl("login.png");
const loading = ref(false);
const username = ref("");
const password = ref("");
const deviceId = ref("230324");
const redirect = ref(undefined);

watch(
  route,
  (newRoute) => {
    console.log("newRoute..", newRoute);
    redirect.value = newRoute.query && newRoute.query.redirect;
  },
  { immediate: true }
);

// 登陆
function doLogin() {
  loading.value = true;
  const query = route.query;
  console.log("query....", query);
  console.log("redirect....", redirect);
  userStore
    .login(username.value, password.value)
    .then(() => {
      loading.value = false;
      showSuccessToast("登录成功");
      const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
      otherQueryParams.deviceId = deviceId.value;
      console.log("otherQueryParams..", otherQueryParams);
      router.push({ path: redirect.value || "/", query: otherQueryParams });
    })
    .catch(() => {
      loading.value = false;
      showFailToast("登录失败，请重试");
    });
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-y: scroll;
  background-color: #edf0fa;
}
.top {
  width: 100%;
  height: 225px;
  background-repeat: no-repeat;
  margin: 0px;
  background-size: 100% 100%;
  background-position: center center;
}
.c0 {
  color: #027fe7;
}
.c1 {
  color: #8c8c8c;
}
.title-box {
  padding: 38px 0 46px 77px;
  box-sizing: border-box;
  .title-two {
    margin-left: 8px;
    line-height: 45px;
    height: 30px;
  }
}
.the-form {
  margin-bottom: 60px;
}

.the-button {
}
</style>
