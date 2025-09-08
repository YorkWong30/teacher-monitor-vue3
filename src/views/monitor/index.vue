<template>
  <van-config-provider :theme-vars="themeVars">
    <div class="monitor-box" v-if="data.workflowList && data.workflowList.length">
      <van-image-preview v-model:show="show"> </van-image-preview>
      <!-- <van-nav-bar
        title="医学模拟"
        style="background-color: #235de6"
        :border="false"
        fixed
        placeholder
      /> -->
      <!-- 顶部控制区 -->
      <control-area ref="controlAreaRef" :curWorkFlowObj="curWorkFlowObj" :currentPersonId="currentPersonId"
        :examPointList="examPointList" :workflowChart="data.workflowChart" :disease="data.disease"
        :checkReport="data.checkReport" @onPush="onPush" @onApply="onApply" @onReset="onReset"
        @updateMonitor="updateMonitor" @updateDetailMiniPopup="updateDetailMiniPopup"
        @doEvaluationTip="doEvaluationTip"></control-area>

      <detail-popup v-model:show="showDetailMiniPopup" :data="showDetailMiniPopup_data"></detail-popup>

      <fixed-step :renderList="curWorkFlowObj?.childList" @emitSuccess="emitSuccess"></fixed-step>

      <!-- tab切换区 -->
      <div style="" class="common-out-box">
        <van-tabs v-model:active="active" type="card" swipe-threshold="3" background="#f2f4fa" color="#ffffff"
          title-inactive-color="#595959" title-active-color="#000000">

          <!-- 评价表 -->
          <van-tab name="7777" v-if="data?.currentEvaluation">
            <template v-slot:title>
              <div class="x-f" style="line-height: 20px">
                <van-icon v-if="active == 8888" size="26" name="description" />
                <div class="more-t">评价表</div>
              </div>
            </template>
            <div class="common-tab" :style="{
              height: `calc(100vh - ${dtHeight}px - 80px - 70px - ${data.currentPromptList && data.currentPromptList.length ? 120 : 0}px)`,
              overflow: 'auto',
            }">
              <evaluate-list :evaluation="data.currentEvaluation" :personId="currentPersonId"
                ref="evaluateListRef"></evaluate-list>
            </div>
          </van-tab>


          <!-- 关键核查表 -->
          <van-tab name="9999">
            <template v-slot:title>
              <div class="x-f" style="line-height: 20px">
                <van-icon v-if="active == 9999" size="26" name="description" />

                <div class="more-t">关键核查表</div>
              </div>
            </template>
            <div class="common-tab" :style="{
              height: `calc(100vh - ${dtHeight}px - 80px - 70px - ${data.currentPromptList && data.currentPromptList.length ? 120 : 0}px)`,
            }">
              <key-checklist :checkList="data.checkList"></key-checklist>
            </div>
          </van-tab>

          <!-- 复盘资料 -->
          <van-tab name="8888" v-if="
            data.reviewList &&
            data.reviewList.length &&
            curWorkFlowObj?.childList &&
            curWorkFlowObj?.childList.length == 0
          ">
            <template v-slot:title>
              <div class="x-f" style="line-height: 20px">
                <van-icon v-if="active == 8888" size="26" name="description" />

                <div class="more-t">复盘资料</div>
              </div>
            </template>
            <div class="common-tab" :style="{
              height: `calc(100vh - ${dtHeight}px - 80px - 70px - ${data.currentPromptList && data.currentPromptList.length ? 120 : 0}px)`,
            }">
              <review-list :reviewList="data.reviewList" @onSendReview="onSendReview"></review-list>
            </div>
          </van-tab>



          <block v-for="tab in curWorkFlowObj?.moduleList" :key="tab.moduleId">
            <van-tab v-if="tab?.moduleId !== 1 && tab?.moduleName !== '提示模块' && tab?.moduleName !== '评分表'"
              :name="tab.moduleId">
              <template v-slot:title>
                <div class="x-f" style="line-height: 20px">
                  <img v-if="active == tab.moduleId && tab.icon" style="width: 32px; height: 32px"
                    :src="imageUrl(tab.icon)" mode="scaleToFill" />
                  <div class="more-t">
                    {{ tab.moduleName }}
                  </div>
                </div>
              </template>
              <div style="" class="common-tab" :style="{
                height: `calc(100vh - ${dtHeight}px - 80px - 70px - ${data.currentPromptList && data.currentPromptList.length ? 120 : 0}px)`,
              }">
                <inquiry v-show="tab.style === 1" :propList="tab" @updateDetailMiniPopup="updateDetailMiniPopup">
                </inquiry>

                <!-- 辅助检查 -->
                <tab-check :propList="tab" v-show="tab.style === 2" @onPush="onPush" @onApply="onApply"></tab-check>
              </div>
            </van-tab>
          </block>

          <!-- <div
            v-if="
              !curWorkFlowObj?.moduleList ||
              (curWorkFlowObj?.moduleList.length == 1 &&
                curWorkFlowObj?.moduleList?.find(
                  (item) => item.moduleId == 1
                ) != undefined)
            "
            class="common-tab x-c"
            style="background-color: #fff"
          >
            当前环节无工具项
          </div> -->
        </van-tabs>
      </div>

      <!-- 语音按钮发送区 -->
      <div class="voice-btn-area" v-if="data.currentPromptList && data.currentPromptList.length">
        <div class="btn-container">
          <div v-for="item in data.currentPromptList" :key="item.reportId" class="voice-btn"
            @click="handleVoicePush(item)">
            <div class="avatar">
              <img :src="item.roleObj.avatarURL" />
              <span>{{ item.roleObj.role }}</span>
            </div>
            <div class="btn-text x-f">
              <van-icon name="volume-o" color="#fff" style="font-size: 25px;" />
              <span>{{ item.note }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-config-provider>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import controlArea from "./components/control-area";
import detailPopup from "./components/detail-popup.vue";
import { queryDiseaseList, teacherPushChangeDisease } from "@/api/caseList";
import fixedStep from "./components/fixed-step";
import evaluateList from "./components/tab-components/evaluate-list.vue";
import keyChecklist from "./components/tab-components/key-checklist.vue";
import reviewList from "./components/tab-components/review-list.vue";
import inquiry from "./components/tab-components/inquiry";
import tabCheck from "@/views/monitor/components/tab-components/tab-check";
const route = useRoute();
const router = useRouter();
import { imageUrl } from "@/utils/ruoyi";
const examPointList = ref([]); //顶部考点
import {
  init,
  teacherPushWorkflow,
  teacherPushReport,
  teacherPushLifeState,
  reset,
  teacherPushMonitor,
  teacherPushReview,
} from "@/api/index";
import { review } from "@/api/index";
// 导入teacherPushPrompt函数
import { teacherPushPrompt } from "@/api/caseList";
import {
  showToast,
  showLoadingToast,
  closeToast,
  showSuccessToast,
  showFailToast,
} from "vant";


const evaluateListRef = ref(undefined);



const currentPersonId = ref(undefined); //当前的设备id
const themeVars = reactive({
  toastTextColor: "#000000",
  // popupBackground: "#000000",
  navBarBackground: "#235de6",
  // paddingMd: "10px",
  navBarTitleTextColor: "#fff",
});
const query = ref(undefined);
const active = ref(0);
const firstWorkflowId = ref(1); //初始的workflowId

const show = ref(false);

const showDetailMiniPopup = ref(false);
const showDetailMiniPopup_data = ref(undefined);

const updateDetailMiniPopup = (data) => {
  showDetailMiniPopup_data.value = data;
  showDetailMiniPopup.value = true;
};

const controlAreaRef = ref();

const doEvaluationTip = () => {
  console.log('evaluateListRef..', evaluateListRef.value);
  if (evaluateListRef.value && evaluateListRef.value.handleEvaluationTip) {
    evaluateListRef.value.handleEvaluationTip();
  } else {
    console.warn('evaluateListRef 或 handleEvaluationTip 方法不存在');
  }
};

//初始化弹出案例资料
// setTimeout(() => {
//   if (controlAreaRef.value) {
//     controlAreaRef.value.doFlowShow();
//   }
// }, 1000);

//监听路由参数
watch(
  route,
  (newRoute) => {
    query.value = newRoute.query;
    console.log("monitor index---query.value..", query.value);
    currentPersonId.value = query.value.deviceId;
  },
  { immediate: true }
);

const PushedReports = ref([]); //已推送的报告
const ApplyedReports = ref([]); //已申请的报告

// 修改已推送的报告的状态
const changeReportStatus = (arr) => {
  if (arr && arr.length) {
    arr.forEach((r) => {
      if (PushedReports.value.includes(r.reportId)) {
        r.isSend = true;
      } else {
        r.isSend = false;
      }
    });
    return arr;
  } else {
    return [];
  }
};

// 修改已申请的报告的状态
const changeReportStatusApply = (arr) => {
  if (arr && arr.length) {
    arr.forEach((r) => {
      if (ApplyedReports.value.includes(r.reportId)) {
        r.isApply = true;
      } else {
        r.isApply = false;
      }
    });
    return arr;
  } else {
    return [];
  }
};
const data = reactive({
  physicalExam: undefined,
  examPoint: undefined,
  inquiry: undefined,
  checkReport: {},
  workflowChart: undefined,
  disease: undefined,
  checkList: [], //关键核查表
  reviewList: [], //新的复盘
  currentPromptList: [], //当前的提示信息
  currentEvaluation: null, //当前疾病的评价表
});

//当前 workflow 对象
const curWorkFlowObj = ref({});

//初始化已推送的报告
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
  }

  dealWidthCurWorkFlowObj();
};

//初始化已申请的报告
const initApplyedReports = () => {
  ApplyedReports.value = localStorage.getItem(
    `${currentPersonId.value}-${query.value.diseaseId}-Apply`
  )
    ? JSON.parse(
      localStorage.getItem(
        `${currentPersonId.value}-${query.value.diseaseId}-Apply`
      )
    )
    : [];
  console.log("setup////ApplyedReports.value..", ApplyedReports.value);
  if (data.checkReport.reportList && data.checkReport.reportList.length) {
    data.checkReport.reportList = changeReportStatusApply(
      data.checkReport.reportList
    );
  }

  dealWidthCurWorkFlowObj();
};
//初始化
const initPage = (needPush = false) => {
  return new Promise((resolve, reject) => {
    showLoadingToast({
      message: "初始化中...",
      forbidClick: true,
      loadingType: "spinner",
    });
    let params = {
      diseaseId: query.value?.diseaseId,
    };
    init(params)
      .then((res) => {
        closeToast();
        data.physicalExam = res.data?.physicalExam;
        data.examPoint = res.data?.examPoint;
        data.inquiry = res.data?.inquiry;
        data.checkList = res.data?.checkList;
        data.reviewList = res.data?.reviewList;

        data.workflowChart = res.data?.workflowChart;
        data.disease = res.data?.disease;
        data.workflowList = res.data?.workflowList;
        data.checkReport.reportList = changeReportStatus(
          res.data?.checkReport?.reportList
        );
        data.checkReport.reportList = changeReportStatusApply(
          res.data?.checkReport?.reportList
        );

        console.log(" data.checkReport...", data.checkReport);

        curWorkFlowObj.value = res.data?.workflowList[0];
        // 处理curWorkFlowObj
        dealWidthCurWorkFlowObj();

        firstWorkflowId.value = curWorkFlowObj.value.workflowId;
        console.log("curWorkFlowObj...", curWorkFlowObj.value);

        if (needPush) {
          let checkList = curWorkFlowObj.value?.checkList;
          let HR_item = null
          let HR_itemValue = null
          let arrList = []
          if (checkList && checkList.length) {
            HR_item = checkList.filter(
              (item) => item.item === "HR"
            );
            console.log('HR_item..', HR_item);

            if (HR_item && HR_item.length) {
              arrList = HR_item[0]?.arrList
              HR_itemValue = parseInt(HR_item[0]?.itemValue)
            }
          }

          let params = {
            diseaseId: query.value.diseaseId,
            personId: currentDeviceId.value,
            deviceId: currentDeviceId.value,
            arrList,
            itemValue: HR_itemValue
          };


          teacherPushChangeDisease(params)
        }

        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


//当前控制的设备 id
const currentDeviceId = ref(undefined);
watch(
  route,
  (newRoute) => {
    console.log("caseList.newRoute.", newRoute);
    currentDeviceId.value = newRoute.query?.deviceId;
  },
  { immediate: true }
);

// 递归通过 workflowId 查找对应的环节数据
const filterDataByWorkflowId = (workflowIdParams, arr) => {
  if (arr && arr.length) {
    arr.forEach((arrItem) => {
      if (arrItem.workflowId == workflowIdParams) {
        curWorkFlowObj.value = JSON.parse(JSON.stringify(arrItem));
        dealWidthCurWorkFlowObj();
        return false;
      } else {
        filterDataByWorkflowId(workflowIdParams, arrItem.childList);
      }
    });
  }
};

//after update CurWorkFlowObj,we need some action;
const dealWidthCurWorkFlowObj = () => {
  console.log('dealWidthCurWorkFlowObj---------------------');

  console.log("examPointList.value", examPointList.value);
  console.log("curWorkFlowObj.value", curWorkFlowObj.value);

  examPointList.value.splice(0);
  if (curWorkFlowObj.value && curWorkFlowObj.value?.moduleList?.length) {
    curWorkFlowObj.value?.moduleList.forEach((item, index, arr) => {
      //赋值顶部考点
      if (arr[index].moduleId === 1) {
        examPointList.value =
          JSON.parse(JSON.stringify(arr[index].pointList)) || [];
      }

      //辅助检查的报告推送状态修改
      if (arr[index].moduleId === 4) {
        arr[index].reportList = changeReportStatus(arr[index].reportList);
        arr[index].reportList = changeReportStatusApply(arr[index].reportList);
      }

      // 赋值提示信息
      // if (arr[index].moduleName === '提示模块') {
      //   if (arr[index]?.reportList && arr[index]?.reportList.length) {
      //     arr[index]?.reportList.forEach(item => {
      //       item.roleObj = JSON.parse(item?.reportName)
      //       data.currentPromptList.push(item)
      //     })
      //   }

      // }


      // 赋值评价表
      if (arr[index].moduleName === '评分表' || arr[index].moduleName === '任务') {
        if (arr[index]?.evaluationList && arr[index]?.evaluationList.length) {
          data.currentEvaluation = arr[index]?.evaluationList[0]
        }

      }
    });

    console.log('data.currentPromptList', data.currentPromptList);
    console.log('data.currentEvaluation', data.currentEvaluation);

  }
};

// 推进下一环节
const emitSuccess = (item) => {
  calcHeight();
  console.log("推进下一环节", item);
  if (item.childList.length) {
    // 跳过type == 2的检查项
    if (item.childList[0].type == 2) {
      curWorkFlowObj.value = item?.childList[0];
    } else {
      curWorkFlowObj.value = item;
    }
  } else {
    let theWorkFlowId = item.workflowId;
    //flow中存在循环的步骤
    if (item.cycleChildId) {
      theWorkFlowId = item.cycleChildId;
    }
    filterDataByWorkflowId(theWorkFlowId, data.workflowList);
  }
  dealWidthCurWorkFlowObj();
  console.log("curWorkFlowObj.value.....", curWorkFlowObj.value);
  setTimeout(() => {
    if (
      curWorkFlowObj.value?.moduleList &&
      curWorkFlowObj.value?.moduleList.length
    ) {
      var tempItem = curWorkFlowObj.value?.moduleList.find(
        (mItem) => mItem.moduleId != 1
      );
    }
    console.log("tempItem.....", tempItem);

    if (tempItem) {
      active.value = tempItem?.moduleId;
      console.log("active.value.....", active.value);
    }
  }, 50);

  console.log("curWorkFlowObj.value...", curWorkFlowObj.value);

  let HR_item = null
  let HR_itemValue = null
  let arrList = []
  if (curWorkFlowObj.value.checkList && curWorkFlowObj.value.checkList.length) {
    HR_item = curWorkFlowObj.value.checkList.filter(
      (item) => item.item === "HR"
    );
    console.log('HR_item..', HR_item);

    if (HR_item && HR_item.length) {
      arrList = HR_item[0]?.arrList
      HR_itemValue = parseInt(HR_item[0]?.itemValue)
    }
  }

  let params = {
    diseaseId: query.value?.diseaseId,
    workflowId: curWorkFlowObj.value.workflowId,
    personId: currentPersonId.value,
    arrList,
    itemValue: HR_itemValue
  };
  teacherPushWorkflow(params).then((res) => {
    showSuccessToast({
      message: "流程推送成功",
      duration: 400,
    });
  });

  console.log("fuck you---curWorkFlowObj.value...", curWorkFlowObj.value);

  if (curWorkFlowObj.value?.childList?.length == 0) {
    try {
      // 获取缓存在本地的evaluationResultId
      const evaluationResultId = localStorage.getItem("current_evaluationResultId");
      console.log("fuck 获取缓存在本地的evaluationResultIdyou---evaluationResultId...", evaluationResultId);

      review({ diseaseId: query.value?.diseaseId, personId: query.value?.personId, evaluationResultId });
    } catch (e) {
      console.warn("调用复盘接口失败", e);
    }
  }

};

// 推送报告
const onPush = (item) => {
  let params = {
    diseaseId: query.value?.diseaseId,
    checkId: item.checkId,
    personId: currentPersonId.value,
    ONLY_SINGLE: true
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

const removeValue = (array, value) => {
  return array.filter(function (item) {
    return item !== value;
  });
};

//申请报告单
const onApply = ({ item, theType }) => {
  console.log("item, theType,", item, theType);
  if (theType) {
    ApplyedReports.value.push(item.reportId);
  } else {
    ApplyedReports.value = removeValue(ApplyedReports.value, item.reportId);
  }
  localStorage.setItem(
    `${currentPersonId.value}-${query.value.diseaseId}-Apply`,
    JSON.stringify(ApplyedReports.value)
  );
  initApplyedReports();
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
        localStorage.removeItem(
          `${currentPersonId.value}-${query.value.diseaseId}-Apply`
        );

        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const onReset = async () => {

  // 清空本地缓存 current_evaluationResultId
  localStorage.removeItem('current_evaluationResultId')

  showLoadingToast({
    message: "重置当前训练中...",
    forbidClick: true,
    overlay: true,
    duration: 1000,
  });

  await resetReoprt();
  initPushedReports();
  initApplyedReports();
  // await setLifeState({
  //   id: -100,
  // });
  await initPage(true);
  active.value = 2;

  // 刷新页面
  setTimeout(() => {
      // 刷新当前页面
  window.location.reload();
    showSuccessToast({
      message: "训练已重置",
    });

  }, 1000);
};

//更新monitor
const updateMonitor = (e) => {
  console.log('curWorkFlowObj..', curWorkFlowObj.value);

  showLoadingToast({
    message: "更新监护仪中...",
    forbidClick: true,
    overlay: true,
    duration: 1000,
  });
  console.log("updateMonitor..", e);
  // 找出curWorkFlowObj.value.checkList中item === "HR"的arrList

  let HR_item = null
  let arrList = []
  if (curWorkFlowObj.value.checkList && curWorkFlowObj.value.checkList.length) {
    HR_item = curWorkFlowObj.value.checkList.filter(
      (item) => item.item === "HR"
    );
    console.log('HR_item..', HR_item);

    if (HR_item && HR_item.length) arrList = HR_item[0]?.arrList
  }

  let params = {
    diseaseId: query.value?.diseaseId,
    personId: currentPersonId.value,
    monitorData: e,
    arrList,
    itemValue: e?.HR

  };
  teacherPushMonitor(params).then((res) => { });
};

//推送复盘内容
const onSendReview = (obj) => {
  obj.personId = currentPersonId.value;
  obj.diseaseId = query.value?.diseaseId;
  console.log("obj..", obj);
  return new Promise((resolve, reject) => {
    teacherPushReview(obj)
      .then((res) => {
        console.log("res..", res);
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const dtHeight = ref(210);
const calcHeight = () => {
  setTimeout(() => {
    dtHeight.value = controlAreaRef.value.controlAreaRefInside.clientHeight;
    console.log("dtHeight...", dtHeight.value);
  }, 20);
  // const elements = document.querySelectorAll(".common-tab");
  // console.log("elements...", elements);

  // elements.forEach((element) => {
  //   element.style.height = `calc(100vh - ${dtHeight}px - 80px - 70px)`;
  // });
};

// 添加在script setup部分的适当位置
const handleVoicePush = async (role) => {
  try {
    await teacherPushPrompt({
      personId: currentPersonId.value,
      reportId: role.reportId
    });
    showSuccessToast({
      message: "提示信息推送成功",
      duration: 1400,
    });
  } catch (error) {
    showFailToast({
      message: "提示信息推送失败",
      duration: 1400,
    });
    console.error("推送提示信息失败:", error);
  }
};

onMounted(async () => {
  // 清空本地缓存 current_evaluationResultId
  localStorage.removeItem('current_evaluationResultId')
  initPushedReports();
  initApplyedReports();
  await initPage();
  calcHeight();
});
</script>
<style lang="scss">
ul,
ul li {
  list-style-type: inherit;
}

ol {
  list-style-type: decimal;
}

ol li {
  list-style-type: inherit;
}

ul,
ol {
  padding-left: 20px;
}

:root:root {
  --van-toast-text-color: #000;
}

.van-tab__text {
  color: #000;
  font-size: 14px;
}

.van-tabs__nav--card {
  border: none;
  border-radius: 6px 6px 0 0;
}

.van-tab--card {
  border-radius: 6px 6px 0 0;
}

// .van-tabs__wrap {
//   // display: flex;
// }
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

.common-out-box {
  background-color: #e4e9f3;
  padding: 10px 0;
  box-sizing: border-box;
}

.common-tab {
  // height: calc(100vh - 280px - 80px - 70px);
  width: calc(100vw - 20px);
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 0 0 6px 6px;
}

.van-tabs__nav--card {
  margin: 0 10px;
}

.voice-btn-area {
  width: 100%;
  height: 14.666667vw;
  background-color: #2b5de2;
  padding: 5px 10px;
  box-sizing: border-box;
}

.btn-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  height: 100%;
}

.voice-btn {
  flex: 1;
  max-width: 300px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.avatar img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.btn-text {
  background: #235de6;
  color: #fff;
  border: 1px solid #fff;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}
</style>
