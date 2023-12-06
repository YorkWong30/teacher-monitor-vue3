<template>
  <div class="case-list-box">
    <div style="position: fixed; top: 0; width: 100%; z-index: 99">
      <van-nav-bar
        title="九划急症医学模拟"
        :border="false"
        right-text="退出登录"
        :left-text="`设备ID${currentDeviceId}`"
        @click-right="onClickRight"
      />
      <div class="search-content x-f">
        <van-field
          clearable
          v-model="searchValue"
          label=""
          placeholder="请输入疾病名称"
        >
          <!-- <template #button v-if="searchValue != ''">
        <van-button size="small" type="primary">搜索</van-button>
      </template> -->
        </van-field>
      </div>
    </div>
    <div class="item-box">
      <div class="item" v-for="item in chapterList" :key="item">
        <div class="item-title one-t x-f van-hairline--bottom">
          {{ item.chapter }}
        </div>
        <div
          class="son-title one-t x-f"
          v-for="son in item.diseaseList"
          :key="son"
          @click="toMonitor(son)"
        >
          {{ son.diseaseName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
const searchValue = ref("");
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { queryDiseaseList, teacherPushChangeDisease } from "@/api/caseList";
const chapterList = ref([]);
import useUserStore from "@/store/modules/user";
import { showConfirmDialog } from "vant";

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
  let params = {
    diseaseId: son.diseaseId,
    diseaseName: son.diseaseName,
    personId: currentDeviceId.value,
    deviceId: currentDeviceId.value,
  };
  console.log("params..", params);
  teacherPushChangeDisease(params).then(() => {
    router.push({ path: "/monitor", query: params });
  });
};

const init = () => {
  let params = {};
  queryDiseaseList(params)
    .then((result) => {
      chapterList.value = result.data.chapterList;
    })
    .catch(() => {});
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
onMounted(() => {
  init();
});
</script>
<style lang="scss">
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
  height: 56px;
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
      display: inline-block;
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
</style>
