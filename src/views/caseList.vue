<template>
  <div class="case-list-box">
    <div style="position: fixed; top: 0; width: 100%; z-index: 99">
      <van-nav-bar title="九划急症医学模拟" :border="false" right-text="退出登录" :left-text="`设备ID${currentDeviceId}`"
        @click-right="onClickRight" />
      <div class="search-content x-f">
        <van-field clearable v-model="searchValue" label="" placeholder="请输入疾病名称">

        </van-field>

        <div class="add-btn">
          <van-button size="mini" type="primary" style="white-space: nowrap;" @click="addNewCase">新增疾病</van-button>
        </div>

      </div>
    </div>

    <div class="item-box">
      <div class="item" v-for="item in chapterList" :key="item">
        <div class="item-title one-t x-f van-hairline--bottom">
          {{ item.chapter }}
        </div>
        <div class="son-title one-t x-bc" v-for="son in item.diseaseList" :key="son">
          <span @click="toMonitor(son)"> {{ son.diseaseName }}</span>
          <div class="x-f">
            <span class="self-button" @click.stop="showPoint(son)">
              「案例详情」
            </span>
            <span class="self-button" @click.stop="showProp(son)">
              「备物清单」
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 备物清单 -->
    <van-action-sheet v-model:show="propShow" title="备物清单" style="height: 90%">
      <div class="store-content fontFCSM" style="text-align: left" v-if="propHTML" v-html="propHTML"></div>
      <div class="store-content fontFCSM" v-else>空</div>
    </van-action-sheet>

    <!-- 案例详情 -->
    <van-action-sheet v-model:show="pointShow" title="案例详情" style="height: 90%">
      <div class="store-content fontFCSM" style="text-align: left" v-if="pointHTML" v-html="pointHTML"></div>
      <div class="store-content fontFCSM" v-else>空</div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
const searchValue = ref("");
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { queryDiseaseList, teacherPushChangeDisease } from "@/api/caseList";
import {
  init,
} from "@/api/index";
const chapterList = ref([]);
import useUserStore from "@/store/modules/user";
import { showConfirmDialog } from "vant";
const propShow = ref(false);
const propHTML = ref("");
const showProp = (son) => {
  console.log("son..", son);
  propShow.value = true;
  propHTML.value = son.prop;
};

const pointShow = ref(false);
const pointHTML = ref("");
const showPoint = (son) => {
  pointShow.value = true;
  pointHTML.value = son.point;
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

// 选择病例，进入monitor
const toMonitor = (son) => {
  init({
    diseaseId: son.diseaseId,
  })
    .then((res) => {
      console.log("init.res...", res);

      let checkList = res.data?.workflowList[0]?.checkList;
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
        diseaseId: son.diseaseId,
        diseaseName: son.diseaseName,
        personId: currentDeviceId.value,
        deviceId: currentDeviceId.value,
        arrList,
        itemValue: HR_itemValue
      };


      teacherPushChangeDisease(params).then(() => {
        router.push({ path: "/monitor", query: params });
      }).catch(() => {
        // router.push({ path: "/monitor", query: params });
      })
    })

};

const initPage = () => {
  let params = {};
  queryDiseaseList(params)
    .then((result) => {
      chapterList.value = result.data.chapterList;
    })
    .catch(() => { });
};

const onClickRight = () => {
  showConfirmDialog({
    title: "提示",
    message: "确定退出登录？",
  })
    .then(() => {
      // on confirm
      useUserStore()
        .logOut()
        .then(() => {
          // location.href = "/";
          router.go(-1);
        });
    })
    .catch(() => {
      // on cancel
    });
};


// 去新增页面
const addNewCase = () => {
  router.push({ path: "/addNewCase" });
};


onMounted(() => {
  initPage();
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

:root {
  --van-nav-bar-background: #235de6;
}

.van-nav-bar__title {
  color: #ffffff;
  font-size: 22px;
}

.van-field__body {
  background-color: #f2f3f5;
  padding-left: 16px;
  // height: 56px  !important;
  border-radius: 6px;
}

.case-list-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.search-content {
  background-color: #ffffff;
  width: 100%;
  height: 86px;
  box-sizing: border-box;
}

.item-box {
  width: calc(100vw - 34px);
  margin: 0 auto;
  padding-bottom: 30px;
  padding-top: 152px;
  box-sizing: border-box;

  .item {
    width: inherit;

    .item-title {
      position: relative;
      width: inherit;
      height: 56px;
      padding-left: 9px;
      box-sizing: border-box;
      color: #007fe7;
      font-size: 16px;

      &::before {
        position: absolute;
        content: "";
        background-color: #007fe7;
        width: 4px;
        height: 15px;
        border-radius: 2px;
        left: 0px;
      }
    }

    .son-title {
      width: 99%;
      max-width: 99%;
      text-align: left;
      color: #000000;
      font-size: 20px;
      padding-left: 20px;
      height: 56px;
      line-height: 56px;
      box-sizing: border-box;
    }
  }
}

.store-content {
  padding: 16px;
  box-sizing: border-box;
  min-height: 100%;
  max-height: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.self-button {
  color: #168ae9;
  font-size: 15px;
}

.add-btn {
  padding-right: 10px;
  box-sizing: border-box;
}
</style>
