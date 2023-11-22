<template>
  <van-config-provider :theme-vars="themeVars">
    <van-popup
      :show="show"
      :close-on-click-overlay="false"
      :style="{ padding: '0px' }"
      @close="close"
    >
      <div class="check-box">
        <div class="title-box--flow van-hairline--bottom x-c bold">
          <div>检查报告单</div>
        </div>
        <van-grid :border="false" clickable column-num="5" class="grid-content">
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
                height: 25px;
                color: #fff;
                width: 60px;
                font-size: 14px;
                padding: 0;
              "
              >{{ item.isSend ? "已推送" : "推送" }}</van-button
            >
          </van-grid-item>
        </van-grid>
        <div class="footer-box x-ac">
          <van-button size="mini" type="primary" plain @click="close"
            >关闭弹窗</van-button
          >
          <!-- <van-button
            :disabled="updateButtonDisabled"
            size="small"
            type="primary"
            @click="update"
            >确定更新</van-button
          > -->
        </div>
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
  // background2: "rgba(0, 0, 0, 0.7)",
});
const props = defineProps({
  checkReport: {
    type: Object,
    default: () => {},
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
  },
  {
    immediate: true,
    deep: true,
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
  font-size: 26px;
  height: 60px;
  background-color: #ffffff;
}
.check-box {
  width: 100%;
  border-radius: 6px;
  background-color: #ffffff;
}
.footer-box {
  width: 100%;
  height: 70px;
  padding: 10px 0;
}

.grid-content {
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
}
</style>
