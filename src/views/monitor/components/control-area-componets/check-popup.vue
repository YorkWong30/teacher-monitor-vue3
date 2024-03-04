<template>
  <van-config-provider :theme-vars="themeVars">
    <van-popup
      :show="show"
      :close-on-click-overlay="false"
      @close="close"
      style="background-color: transparent"
    >
      <div class="check-box">
        <div class="title-box--flow van-hairline--bottom x-c bold">
          <div>检查报告单</div>
        </div>
        <div style="background-color: #fff; padding: 7px 0">
          <div class="apply-tip-box  x-c">请注意标记学员已申请的检查项目</div>
        </div>
        <van-grid
          :border="true"
          clickable
          column-num="4"
          :gutter="2"
          class="grid-content"
          v-if="checkReport?.reportList?.length"
        >
          <van-grid-item
            v-for="(item, index) in checkReport?.reportList"
            :key="item?.reportId"
            style="margin-bottom: 5px"
          >
            <div
              class="apply-div-v2 x-c"
              v-if="!item.isApply"
              @click.stop="apply(item, true)"
            >
              <div class="x-c">
                <img
                  style=""
                  src="@/assets/images/check-no.png"
                  mode="scaleToFill"
                />
                申请检查
              </div>
            </div>
            <div
              class="apply-div-v2 x-c apply-checked"
              v-else
              @click.stop="apply(item, false)"
            >
              <div class="x-c">
                <img
                  style=""
                  src="@/assets/images/check-yes.png"
                  mode="scaleToFill"
                />
                取消申请
              </div>
            </div>
            <van-image
              style="width: 100%; height: 100%; position: relative"
              fit="contain"
              :src="item?.url"
              @click="onImage(item, index)"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
            <div
              style="
                height: 70px;
                width: 100%;
                font-size: 18px;
                color: #595959;
                line-height: 22px;
              "
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
                height: 32px;
                padding: 5px;
                color: #fff;
                width: 70px;
                font-size: 14px;
                padding: 0;
              "
              >{{ item.isSend ? "已推送" : "推送" }}</van-button
            >
          </van-grid-item>
        </van-grid>
        <div class="grid-content" v-else>
          <van-empty description="暂无报告" />
        </div>

        <div class="footer-box x-ac">
          <van-icon name="close" color="#ffffff" size="45px" @click="close" />
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
const emits = defineEmits(["update:show", "onPushed", "onApplyed"]);

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
// 申请报告单
const apply = (item, theType) => {
  console.log("aaa....", item, theType);

  emits("onApplyed", { item, theType });
};
</script>
<style lang="scss" scoped>
:deep(.van-grid-item__content) {
  padding: 0 0 10px 0 !important;
}
.title-box--flow {
  font-size: 26px;
  height: 60px;
  background-color: #ffffff;
}
.check-box {
  width: 100%;
  border-radius: 6px;
  overflow-x: hidden;
}
.footer-box {
  width: 100%;
  height: 70px;
  padding: 10px 0;
  background-color: transparent;
}

.grid-content {
  min-width: 90vw;
  max-height: 550px;
  overflow-y: auto;
  background-color: #ffffff;
  width: 100%;
}
.apply-tip-box {
  height: 40px;
  padding: 5px 0;
  margin: 0 10px;
  box-sizing: border-box;
  background-color: #fef5e7;
  font-size: 14px;
  color: #000;
  border-radius: 4px;
}
.apply-div-v2 {
  padding: 2px 0;
  height: 35px;
  width: 100%;
  background-color: #f2f4f9;
  font-size: 12px;
  color: #0e0f0f;
  img {
    width: 22px;
    height: 22px;
  }
}
.apply-checked {
  padding: 2px 0;

  background-color: #5fc97a !important;
  transition: all 2s;
  color: #ffffff;
}
</style>
