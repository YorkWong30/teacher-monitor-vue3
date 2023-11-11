<template>
  <div class="check-box">
    <div class="point">
      <div
        class="point-item"
        v-for="(item, index) in auxiliaryExamPointList"
        :key="item?.pointId"
      >
        <span class="blue" style="margin-right: 7px">要点{{ index + 1 }}:</span>
        <span>{{ item?.point }}</span>
      </div>
    </div>
    <van-grid :border="false" clickable column-num="5">
      <van-grid-item
        v-for="(item, index) in auxiliaryExamReportList"
        :key="item?.reportId"
      >
        <van-image :src="item?.url" @click="onImage(item, index)">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
        <div
          style="height: 35px; width: 100%; font-size: 12px; color: #595959"
          class="more-t"
        >
          {{ item?.reportName }}
        </div>
        <van-button
          size="mini"
          round
          type="default"
          color="#235de6"
          :disabled="item.isSend"
          @click="send(item, index)"
          style="
            height: 20px;
            color: #fff;
            width: 40px;
            font-size: 10px;
            padding: 0;
          "
          >{{ item.isSend ? "已推送" : "推送" }}</van-button
        >
      </van-grid-item>
    </van-grid>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";
import { ImagePreview, showImagePreview } from "vant";

const props = defineProps({
  auxiliaryExamPointList: {
    type: Array,
  },
  auxiliaryExamReportList: {
    type: Array,
  },
});

const emits = defineEmits(["onPush"]);

const checkReportImageList = ref([]);
//报告的图片数据转数组
watch(
  () => props.auxiliaryExamReportList,
  (newVal) => {
    console.log("newVal...auxiliaryExamReportList", newVal);
    checkReportImageList.value.splice(0);
    if (newVal && newVal && newVal.length) {
      newVal.forEach((element) => {
        checkReportImageList.value.push(element.url);
      });
    }
    console.log(
      "auxiliaryExamReportList;checkReportImageList..",
      checkReportImageList
    );
  },
  {
    immediate: true,
  }
);

// 查看报告单
const onImage = (item, index) => {
  console.log(" (item, index) ..", item, index);
  showImagePreview({
    images: checkReportImageList.value,
    startPosition: index,
    closeable: true,
  });
};

// 推送报告单
const send = (item, index) => {
  // item.isSend = true;
  emits("onPush", item);
};
</script>
<style lang="scss">
:root {
  --van-popup-close-icon-size: 24px;
  --van-popup-close-icon-margin: 15px;
}
.title-box--flow {
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;
}
.check-box {
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
.blue {
  color: #007fe7;
}
</style>
