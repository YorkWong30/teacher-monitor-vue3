<template>
  <van-config-provider :theme-vars="themeVars">
    <div class="monitor-box">
      <van-nav-bar
        title="医学模拟"
        style="background-color: #235de6"
        :border="false"
        fixed
        placeholder
      />
      <!-- 顶部控制区 -->
      <control-area
        :curWorkFlowObj="curWorkFlowObj"
        :examPointList="curWorkFlowObj?.examPointList"
        :workflowChart="data.workflowChart"
        :checkReport="data.checkReport"
        @onPush="onPush"
        @onReset="onReset"
        @updateMonitor="updateMonitor"
      ></control-area>

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
              <!-- 问诊对话 -->
              <inquiry v-show="active == 0" :propList="data.inquiry"></inquiry>
              <!-- 体检结果 -->
              <inquiry
                v-show="active == 1"
                :propList="data.physicalExam"
              ></inquiry>
              <!-- 辅助检查 -->
              <tab-check
                :auxiliaryExamPointList="curWorkFlowObj?.auxiliaryExamPointList"
                :auxiliaryExamReportList="
                  curWorkFlowObj?.auxiliaryExamReportList
                "
                v-show="active == 2"
                @onPush="onPush"
              ></tab-check>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <fixed-step
        :renderList="curWorkFlowObj?.childList"
        @emitSuccess="emitSuccess"
      ></fixed-step></div
  ></van-config-provider>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import controlArea from "./components/control-area";
import fixedStep from "./components/fixed-step";

import inquiry from "./components/tab-components/inquiry";
import tabCheck from "@/views/monitor/components/tab-components/tab-check";
const route = useRoute();
const router = useRouter();
import { imageUrl } from "@/utils/ruoyi";

import {
  init,
  teacherPushWorkflow,
  teacherPushReport,
  teacherPushLifeState,
  reset,
  teacherPushMonitor,
} from "@/api/index";
import {
  showToast,
  showLoadingToast,
  showSuccessToast,
  showFailToast,
} from "vant";

const currentPersonId = ref(230324); //当前的学员id
const themeVars = reactive({
  toastTextColor: "#000000",
  popupBackground: "#000000",
  navBarBackground: "#235de6",
  paddingMd: "10px",
  navBarTitleTextColor: "#fff",
});
const query = ref(undefined);
const active = ref(0);
const firstWorkflowId = ref(1); //初始的workflowId
//监听路由参数
watch(
  route,
  (newRoute) => {
    query.value = newRoute.query;
    console.log("query.value..", query.value);
  },
  { immediate: true }
);

const PushedReports = ref([]); //已推送的报告

// 修改已推送的报告的状态
const changeReportStatus = (arr) => {
  arr.forEach((r) => {
    if (PushedReports.value.includes(r.reportId)) {
      r.isSend = true;
    } else {
      r.isSend = false;
    }
  });
  return arr;
};
const data = reactive({
  physicalExam: undefined,
  examPoint: undefined,
  inquiry: undefined,
  checkReport: {},
  workflowChart: undefined,
});

//当前 workflow 对象
const curWorkFlowObj = ref({});
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
const initPushedReports = () => {
  PushedReports.value = localStorage.getItem(
    `${currentPersonId.value}-${query.value.diseaseId}`
  )
    ? JSON.parse(
        localStorage.getItem(
          `${currentPersonId.value}-${query.value.diseaseId}`
        )
      )
    : [];
  console.log("setup////PushedReports.value..", PushedReports.value);
  if (data.checkReport.reportList && data.checkReport.reportList.length) {
    data.checkReport.reportList = changeReportStatus(
      data.checkReport.reportList
    );
    curWorkFlowObj.value.auxiliaryExamReportList = changeReportStatus(
      curWorkFlowObj.value.auxiliaryExamReportList
    );
  }

  if (
    curWorkFlowObj.value.auxiliaryExamReportList &&
    curWorkFlowObj.value.auxiliaryExamReportList.length
  ) {
    curWorkFlowObj.value.auxiliaryExamReportList = changeReportStatus(
      curWorkFlowObj.value.auxiliaryExamReportList
    );
  }
};
//初始化
const initPage = () => {
  return new Promise((resolve, reject) => {
    let params = {
      diseaseId: query.value?.diseaseId,
    };
    init(params)
      .then((res) => {
        data.physicalExam = res.data?.physicalExam;
        data.examPoint = res.data?.examPoint;
        data.inquiry = res.data?.inquiry;
        data.workflowChart = res.data?.workflowChart;
        data.workflowList = res.data?.workflowList;
        data.checkReport.reportList = changeReportStatus(
          res.data?.checkReport?.reportList
        );

        console.log(" data.checkReport...", data.checkReport);

        curWorkFlowObj.value = res.data?.workflowList[0];
        curWorkFlowObj.value.auxiliaryExamReportList = changeReportStatus(
          res.data?.workflowList[0]?.auxiliaryExamReportList
        );

        firstWorkflowId.value = curWorkFlowObj.value.workflowId;
        console.log("curWorkFlowObj...", curWorkFlowObj.value);

        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 递归通过 workflowId 查找对应的环节数据
const filterDataByWorkflowId = (workflowIdParams, arr) => {
  if (arr && arr.length) {
    arr.forEach((arrItem) => {
      if (arrItem.workflowId == workflowIdParams) {
        curWorkFlowObj.value = JSON.parse(JSON.stringify(arrItem));
        return false;
      } else {
        filterDataByWorkflowId(workflowIdParams, arrItem.childList);
      }
    });
  }
};

// 推进下一环节
const emitSuccess = (item) => {
  console.log("next。。item。。", item);
  if (item.childList.length) {
    // 跳过type == 2的检查项
    if (item.childList[0].type == 2) {
      curWorkFlowObj.value = item?.childList[0];
    } else {
      curWorkFlowObj.value = item;
    }
  } else {
    let theWorkFlowId = item.workflowId;
    //flowh中存在循环的步骤
    if (item.cycleChildId) {
      theWorkFlowId = item.cycleChildId;
    }
    filterDataByWorkflowId(theWorkFlowId, data.workflowList);
  }

  console.log("curWorkFlowObj.value.....", curWorkFlowObj.value);

  let params = {
    diseaseId: query.value?.diseaseId,
    workflowId: curWorkFlowObj.value.workflowId,
    personId: currentPersonId.value,
  };
  teacherPushWorkflow(params).then((res) => {
    showSuccessToast({
      message: "流程推送成功",
      duration: 800,
    });
  });
};

// 推送报告
const onPush = (item) => {
  let params = {
    diseaseId: query.value?.diseaseId,
    checkId: item.checkId,
    personId: currentPersonId.value,
  };
  teacherPushReport(params).then((res) => {
    PushedReports.value.push(item.reportId);
    localStorage.setItem(
      `${currentPersonId.value}-${query.value.diseaseId}`,
      JSON.stringify(PushedReports.value)
    );
    initPushedReports();
    showSuccessToast({
      message: "报告推送成功",
      duration: 800,
    });
  });
};

//推送患者生命状态
const setLifeState = (item) => {
  console.log("setLifeStateitem...", item);
  return new Promise((resolve, reject) => {
    teacherPushLifeState({
      lifeState: item.id,
      diseaseId: query.value?.diseaseId,
      personId: currentPersonId.value,
    }).then((res) => {
      resolve();
    });
  });
};

//重置报告单
const resetReoprt = () => {
  return new Promise((resolve, reject) => {
    let params = {
      diseaseId: query.value?.diseaseId,
      personId: currentPersonId.value,
    };
    reset(params)
      .then(() => {
        //清空缓存中的报告单
        localStorage.removeItem(
          `${currentPersonId.value}-${query.value.diseaseId}`
        );

        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const onReset = async () => {
  showLoadingToast({
    message: "重置当前训练中...",
    forbidClick: true,
    overlay: true,
    duration: 1000,
  });
  await resetReoprt();
  initPushedReports();
  await setLifeState({
    id: -100,
  });
  await initPage();
  setTimeout(() => {
    showSuccessToast({
      message: "训练已重置",
    });
  }, 1000);
};

//更新monitor
const updateMonitor = (e) => {
  showLoadingToast({
    message: "更新监护仪中...",
    forbidClick: true,
    overlay: true,
    duration: 1000,
  });
  console.log("updateMonitor..", e);
  let params = {
    diseaseId: query.value?.diseaseId,
    personId: currentPersonId.value,
    monitorData: e,
  };
  teacherPushMonitor(params).then((res) => {});
};

onMounted(() => {
  initPushedReports();
  initPage();
});
</script>
<style lang="scss">
:root:root {
  --van-toast-text-color: #000;
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
  // color: #ffffff;
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
