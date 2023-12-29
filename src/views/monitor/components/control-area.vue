<template>
  <div class="control-box">
    <van-row gutter="5">
      <!-- <van-col span="4">
        <div class="common-col head x-c">
          <img :src="imageUrl('head.png')" mode="scaleToFill" />

          <div class="id white">
            <div>设备ID</div>
            <div class="bold">{{ currentPersonId }}</div>
          </div>
        </div>
      </van-col> -->
      <van-col span="8">
        <div class="common-col monitor x-ac">
          <!-- <img :src="imageUrl('monitor.png')" mode="scaleToFill" /> -->
          <img src="@/assets/images/monitor.gif" mode="scaleToFill" />
          <div class="y-ac" style="height: 90%; box-sizing: border-box">
            <div class="f14">心电监护仪</div>
            <div class="x-f">
              <!-- <van-switch
                v-model="monitorIsOpen"
                disabled
                active-color="#74C818"
                inactive-color="#000000"
                size="15px"
              /> -->
              <van-button
                @click="doMonitorSettingShow"
                size="small"
                plain
                type="default"
                :disabled="!monitorIsOpen"
                style="
                  height: 26px;
                  font-size: 20px;
                  color: #000;
                  background: #fff;
                "
                >设置</van-button
              >
            </div>
          </div>
        </div>
      </van-col>
      <van-col span="4" @click="doFlowShow">
        <div class="common-col common-control flow y-bc">
          <div class="white f14">案例资料</div>
          <img :src="imageUrl('flow.png')" mode="scaleToFill" /></div
      ></van-col>
      <van-col span="4" @click="doCheckShow">
        <div class="common-col common-control flow y-bc">
          <div class="white f14">所有检查</div>
          <img :src="imageUrl('assist.png')" mode="scaleToFill" /></div
      ></van-col>
      <van-col span="4">
        <div class="common-col common-control flow y-bc" @click="reset">
          <div class="white f14">重置训练</div>
          <img :src="imageUrl('reset.png')" mode="scaleToFill" /></div
      ></van-col>
      <van-col span="4">
        <div class="common-col common-control flow y-bc" @click="change">
          <div class="white f14">切换案例</div>
          <!-- <img :src="imageUrl('reset.png')" mode="scaleToFill" />-->
        </div></van-col
      >
    </van-row>
    <div class="title-box">
      <span class="one-t"> {{ curWorkFlowObj?.workflowName }}</span>
    </div>
    <div class="second-box">
      <div class="list-box">
        <div
          class="detail-button"
          v-if="
            examPointList &&
            examPointList.length &&
            examPointList[0]?.pointType === 2 &&
            examPointList[0]?.point
          "
          @click="showDetailMini(examPointList[0]?.point)"
        >
          <van-icon
            name="question-o"
            color="#1987E1"
            style="margin-right: 6px"
          />详 情
        </div>
        <div
          v-if="examPointList && examPointList.length"
          class="list-item"
          v-html="
            examPointList[0]?.pointType === 1
              ? examPointList[0]?.point
              : examPointList[0]?.pointMini
          "
        ></div>
        <div v-else class="list-item">
          当前环节无考点，老师可根据实际情况进行考察。
        </div>
      </div>
    </div>

    <!--案例流程弹框 -->
    <flow-popup
      v-model:show="showFlowPopup"
      :workflowChart="workflowChart"
      :disease="disease"
    ></flow-popup>

    <!-- 辅助检查弹框 -->
    <check-popup
      :checkReport="checkReport"
      v-model:show="showCheckPopup"
      @onPushed="onPushed"
    ></check-popup>

    <!-- 心电监护仪参数控制板 -->
    <monitor-setting-popup
      v-model:show="showMonitorSettingPopup"
      :curCheckList="curWorkFlowObj.checkList"
      @updateMonitor="updateMonitor"
    ></monitor-setting-popup>
  </div>
</template>
<script setup>
import { getCurrentInstance, ref, defineProps, watch, defineExpose } from "vue";
import flowPopup from "./control-area-componets/flow-popup.vue";
import checkPopup from "./control-area-componets/check-popup.vue";
import monitorSettingPopup from "./control-area-componets/monitor-setting-popup.vue";
import { imageUrl } from "@/utils/ruoyi";
import { showConfirmDialog } from "vant";
import { teacherPushMonitor } from "@/api/index";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  curWorkFlowObj: {
    type: Object,
    required: true,
  },
  workflowChart: {
    type: Object,
    required: true,
  },
  disease: {
    type: Object,
    required: true,
  },
  examPointList: {
    type: Object,
    required: true,
  },
  checkReport: {
    type: Object,
    required: true,
  },
  currentPersonId: {
    type: String,
    default: "",
  },
});

const monitorIsOpen = ref(true); //monitor是否开启
const showCheckPopup = ref(false); //辅助检查弹窗是否开启
const showFlowPopup = ref(false); //步骤图 popup 是否打开
const showMonitorSettingPopup = ref(false); //心电监护仪参数控制板是否开启

const emits = defineEmits([
  "onPush",
  "onReset",
  "updateMonitor",
  "updateDetailMiniPopup",
]);
//查看流程
const doFlowShow = () => {
  showFlowPopup.value = true;
};
const closeFlowPopup = () => {
  showFlowPopup.value = false;
};

//查看辅助检查报告
const doCheckShow = () => {
  showCheckPopup.value = true;
};

const doMonitorSettingShow = () => {
  showMonitorSettingPopup.value = true;
};

const onPushed = (item) => {
  emits("onPush", item);
};

const showDetailMini = (data) => {
  emits("updateDetailMiniPopup", data);
};

const reset = () => {
  showConfirmDialog({
    title: "提示",
    message: "是否重置当前训练？",
  })
    .then(() => {
      // on confirm
      emits("onReset");
    })
    .catch(() => {
      // on cancel
    });
};

const change = () => {
  showConfirmDialog({
    title: "提示",
    message: "是否返回案例列表？",
  })
    .then(() => {
      router.go(-1);
    })
    .catch(() => {});
};

const updateMonitor = (e) => {
  console.log("updateMonitor..", e);
  emits("updateMonitor", e);
};

defineExpose({
  doFlowShow,
});
</script>
<style lang="scss" scoped>
.control-box {
  width: 100%;
  height: 280px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #235de6;
}
.common-col {
  height: 80px;
  width: 100%;
}

.head {
  img {
    width: 53px;
    height: 53px;
    border-radius: 24px;
  }
  .id {
    font-size: 14px;
  }
}
.monitor {
  color: #fff;
  background-color: rgba($color: #000000, $alpha: 0.35);
  border-radius: 8px;
  img {
    width: 75px;
    height: 65px;
  }
}

.common-control {
  background-color: rgba($color: #000000, $alpha: 0.35);
  border-radius: 8px;
  height: 80px;
  box-sizing: border-box;
  padding: 10px 0 8px 0;
  margin: 0 auto;
  img {
    width: 50px;
    height: 36px;
  }
}
.title-box {
  margin: 15px 0 15px 0;
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  text-align: center;
  font-size: 22px;
  line-height: 30px;
  color: #fff;
  font-weight: bold;
  position: relative;
  &::after {
    position: absolute;
    content: "";
    width: 10%;
    height: 4px;
    background-color: #fecd44;
    border-radius: 20px;
    bottom: -5px;
    left: 45%;
  }
}
.second-box {
  width: 100%;
  min-height: 108px;
  height: 108px;
  max-height: 108px;
  overflow: scroll;
  background-color: #ffffff;
  border-radius: 6px;
  box-sizing: border-box;

  position: relative;

  .list-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px 10px 10px 10px;
    box-sizing: border-box;
    position: relative;
    text-align: left;
    .detail-button {
      position: absolute;
      width: 70px;
      height: 32px;
      line-height: 32px;
      background-color: #f3f6f9;
      color: #1987e1;
      font-size: 14px;
      border-radius: 18px 0px 0px 18pt;
      right: 0px;
      bottom: 4%;
      z-index: 999;
      text-align: center;
    }
    .list-item {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      box-sizing: border-box;
      overflow-y: auto;
    }
  }
}
</style>
