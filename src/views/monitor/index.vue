<template>
  <div class="monitor-box">
    <van-nav-bar
      title="医学模拟"
      style="background-color: #235de6"
      :border="false"
      fixed
      placeholder
    />
    <!-- 顶部控制区 -->
    <control-area></control-area>

    <!-- tab切换区 -->
    <div
      style="
        background-color: #e4e9f3;
        padding: 10px 0;

        box-sizing: border-box;
      "
    >
      <van-tabs
        v-model:active="active"
        type="card"
        background="#f2f4fa"
        color="#ffffff"
        title-inactive-color="#595959"
        title-active-color="#000000"
        shrink
      >
        <van-tab v-for="tab in tabList" :key="tab.index">
          <template v-slot:title>
            <div class="x-f">
              <img
                v-if="active == tab.index"
                style="width: 32px; height: 32px"
                :src="imageUrl(tab.icon)"
                mode="scaleToFill"
              />
              <span>{{ tab.title }}</span>
            </div>
          </template>
          <div style="" class="common-tab">
            <inquiry v-show="active == 0" :propList="data.inquiry"></inquiry>
            <inquiry
              v-show="active == 1"
              :propList="data.physicalExam"
            ></inquiry>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <fixed-step></fixed-step>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import controlArea from "./components/control-area";
import fixedStep from "./components/fixed-step";

import inquiry from "./components/tab-components/inquiry";
const route = useRoute();
const router = useRouter();
import { imageUrl } from "@/utils/ruoyi";

import { init } from "@/api/index";

const query = ref(undefined);
const active = ref(0);
const data = reactive({
  physicalExam: undefined,
  examPoint: undefined,
  inquiry: undefined,
  checkReport: undefined,
  workflowChart: undefined,
});
const tabList = ref([
  {
    index: 0,
    title: "问诊对话",
    icon: "chat-tag.png",
    display: true,
  },
  {
    index: 1,
    title: "体检结果",
    icon: "tijian.png",
    display: true,
  },
  {
    index: 2,
    title: "辅助检查",
    icon: "check.png",
    display: true,
  },
]);

//监听路由参数
watch(
  route,
  (newRoute) => {
    query.value = newRoute.query;
    console.log("query.value..", query.value);
  },
  { immediate: true }
);

//初始化
const initPage = () => {
  return new Promise((resolve, reject) => {
    let params = {
      diseaseId: query.value?.diseaseId,
    };
    init(params)
      .then((res) => {
        console.log("res..", res);
        data.physicalExam = res.data?.physicalExam;
        data.examPoint = res.data?.examPoint;
        data.inquiry = res.data?.inquiry;
        data.checkReport = res.data?.checkReport;
        data.workflowChart = res.data?.workflowChart;

        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
onMounted(() => {
  initPage();
});
</script>
<style lang="scss">
:root {
  --van-nav-bar-background: #235de6;
  --van-padding-md: 10px;
}
.van-tab__text {
  color: #000;
  font-size: 16px;
}
.van-tabs__nav--card {
  border: none;
  border-radius: 6px 6px 0 0;
}
.van-tab--card {
  border-radius: 6px 6px 0 0;
}
.van-tabs__wrap {
  display: flex;
}
.van-nav-bar__title {
  color: #ffffff;
  font-size: 22px;
}
.monitor-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.common-tab {
  height: 335px;
  width: calc(100vw - 20px);
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 0 0 6px 6px;
}
</style>
