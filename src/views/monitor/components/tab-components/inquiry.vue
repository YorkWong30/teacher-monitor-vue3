<template>
  <div class="out-box">
    <div
      class="detail-button"
      @click="showDetailMini(propList?.pointList[0]?.point)"
      v-if="
        propList?.pointList &&
        propList?.pointList.length &&
        propList?.pointList[0]?.pointType === 2 &&
        propList?.pointList[0]?.point
      "
    >
      <van-icon
        name="question-o"
        color="#1987E1"
        style="margin-right: 6px"
      />操作详情
    </div>
    <div class="the-box">
      <div class="point">
        <div
          v-if="propList?.pointList && propList?.pointList.length"
          class="point-item"
          v-html="
            propList?.pointList[0]?.pointType === 1
              ? propList?.pointList[0]?.point
              : propList?.pointList[0]?.pointMini
          "
        ></div>
      </div>

      <div
        class="report"
        v-if="propList?.reportList && propList?.reportList.length"
      >
        <van-image
          v-for="(item, index) in propList?.reportList"
          :key="item?.reportId"
          class="img-item"
          :src="item?.url"
        >
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

defineProps(["propList"]);

const emits = defineEmits(["updateDetailMiniPopup"]);
const showDetailMini = (data) => {
  emits("updateDetailMiniPopup", data);
};
</script>
<style lang="scss" scoped>
.out-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .detail-button {
    position: absolute;
    width: 100px;
    height: 32px;
    line-height: 32px;
    background-color: #f3f6f9;
    color: #1987e1;
    font-size: 14px;
    border-radius: 18px 0px 0px 18pt;
    right: 0px;
    top: 4%;
    text-align: center;
  }
}
.the-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 15px 20px;
  box-sizing: border-box;
  overflow-y: auto;
}
.point {
  width: inherit;

  .point-item {
    font-size: 16px;
    text-align: left;
    width: inherit;
    line-height: 30px;
  }
}
.report {
  width: inherit;
  .img-item {
    width: inherit;
  }
}
.blue {
  color: #007fe7;
}
</style>
