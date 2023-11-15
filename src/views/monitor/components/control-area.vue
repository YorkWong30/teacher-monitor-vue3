<template>
  <div class="control-box">
    <van-row gutter="10">
      <van-col span="4">
        <div class="common-col head">
          <img :src="imageUrl('head.png')" mode="scaleToFill" />
          <div class="id white">ID.230324</div>
        </div>
      </van-col>
      <van-col span="8">
        <div class="common-col monitor x-ac">
          <img :src="imageUrl('monitor.png')" mode="scaleToFill" />
          <div class="y-ac" style="height: 90%; box-sizing: border-box">
            <div class="f14">心电监护仪</div>
            <div class="x-f">
              <van-switch
                v-model="monitorIsOpen"
                active-color="#74C818"
                inactive-color="#000000"
                size="15px"
              />
              <van-button
                @click="doMonitorSettingShow"
                size="mini"
                plain
                type="default"
                :disabled="!monitorIsOpen"
                style="
                  height: 16px;
                  color: #000;
                  width: 30px;
                  font-size: 10px;
                  padding: 0;
                  margin-left: 5px;
                "
                >设置</van-button
              >
            </div>
          </div>
        </div>
      </van-col>
      <van-col span="4" @click="doFlowShow">
        <div class="common-col common-control flow y-bc">
          <div class="white f14">案例流程</div>
          <img :src="imageUrl('flow.png')" mode="scaleToFill" /></div
      ></van-col>
      <van-col span="4" @click="doCheckShow">
        <div class="common-col common-control flow y-bc">
          <div class="white f14">辅助检查</div>
          <img :src="imageUrl('assist.png')" mode="scaleToFill" /></div
      ></van-col>
      <van-col span="4">
        <div class="common-col common-control flow y-bc" @click="reset">
          <div class="white f14">模拟重置</div>
          <img :src="imageUrl('reset.png')" mode="scaleToFill" /></div
      ></van-col>
    </van-row>
    <div class="second-box">
      <!-- <div class="title-box van-hairline--bottom x-f">
        <div class="more-t">{{ examPointList[0]?.point }}</div>
      </div> -->
      <div class="list-box">
        <div
          v-if="examPointList && examPointList.length"
          class="list-item"
          v-html="examPointList[0]?.point"
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
import { getCurrentInstance, ref, defineProps, watch } from "vue";
import flowPopup from "./control-area-componets/flow-popup.vue";
import checkPopup from "./control-area-componets/check-popup.vue";
import monitorSettingPopup from "./control-area-componets/monitor-setting-popup.vue";
import { imageUrl } from "@/utils/ruoyi";
import { showConfirmDialog } from "vant";
import { teacherPushMonitor } from "@/api/index";
const props = defineProps({
  curWorkFlowObj: {
    type: Object,
    required: true,
  },
  workflowChart: {
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
});
const textF = ref(
  "<ul>\r\n\t<li>病史采集</li>\r\n\t<li>体格检查</li>\r\n\t</ul>"
);
const monitorIsOpen = ref(true); //monitor是否开启
const showCheckPopup = ref(false); //辅助检查弹窗是否开启
const showFlowPopup = ref(false); //步骤图 popup 是否打开
const showMonitorSettingPopup = ref(false); //心电监护仪参数控制板是否开启

const emits = defineEmits(["onPush", "onReset", "updateMonitor"]);
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

const updateMonitor = (e) => {
  console.log("updateMonitor..", e);
  emits("updateMonitor", e);
};
</script>
<style lang="scss" scoped>
:root {
  --van-switch-width: 30px;
}
.control-box {
  width: 100%;
  height: 343px;
  padding: 0 10px;
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

.second-box {
  width: 100%;
  height: 233px;
  background-color: #ffffff;
  border-radius: 6px;
  margin: 10px 0;
  box-sizing: border-box;
  .title-box {
    padding: 5px 20px;

    box-sizing: border-box;
    width: 100%;
    height: 56px;
    line-height: 20px;
    text-align: left;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
  }
  .list-box {
    height: 100%;
    overflow-y: auto;
    padding: 10px 20px;
    box-sizing: border-box;

    .list-item {
      color: #000;
      font-size: 16px;
      line-height: 30px;
      text-align: left;
    }
  }
}
</style>
