<template>
  <van-config-provider :theme-vars="themeVars">
    <van-popup
      style="width: 100vw; height: 40vh"
      :show="show"
      :close-on-click-overlay="false"
      :style="{ padding: '0px' }"
      closeable
      @close="close"
    >
      <div class="check-box">
        <div class="title-box--flow van-hairline--bottom x-c bold">
          <div>检查报告单</div>
        </div>
        <van-grid :border="false" clickable column-num="5">
          <van-grid-item
            v-for="(item, index) in checkReport?.reportList"
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
    </van-popup>
  </van-config-provider>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref, reactive } from "vue";
import { ImagePreview, showImagePreview } from "vant";
const themeVars = reactive({
  popupCloseIconSize: "24px",
  popupCloseIconMargin: "15px",
  background2: "rgba(0, 0, 0, 0.7)",
});
const props = defineProps({
  checkReport: {
    type: Object,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const checkReportImageList = ref([]);
//报告的图片数据转数组
watch(
  () => props.checkReport,
  (newVal) => {
    checkReportImageList.value.splice(0);
    if (newVal && newVal.reportList && newVal.reportList.length) {
      newVal.reportList.forEach((element) => {
        checkReportImageList.value.push(element.url);
      });
    }
    console.log(";checkReportImageList..", checkReportImageList);
  },
  {
    immediate: true,
  }
);
const emits = defineEmits(["update:show", "onPushed"]);

const close = () => {
  emits("update:show", false);
};

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
  item.isSend = true;
  emits("onPushed", item);
};
</script>
<style lang="scss" scoped>
.title-box--flow {
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;
}
.check-box {
  width: 100%;
  overflow-y: auto;
  height: 100%;
  border-radius: 6px;
  background-color: #ffffff;
}
</style>
