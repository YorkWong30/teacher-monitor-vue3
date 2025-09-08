<template>
  <div class="check-box">
    <!-- <div class="point">
      <div
        class="point-item"
        v-if="propList?.pointList && propList?.pointList.length"
        v-html="propList?.pointList[0]?.point"
      ></div>
    </div> -->
    <!-- <div class="point" v-if="propList?.pointList && propList?.pointList.length">
      <div
        class="point-item"
        v-for="(item, index) in propList?.pointList"
        :key="item?.pointId"
      >
        <span class="blue" style="margin-right: 7px">要点{{ index + 1 }}:</span>
        <span>{{ item?.point }}</span>
      </div>
    </div> -->
    <div class="apply-tip-box x-c">请注意标记学员已申请的检查项目</div>
    <van-grid
      :border="true"
      clickable
      column-num="4"
      :gutter="2"
      v-if="propList?.reportList && propList.reportList.length"
    >
      <van-grid-item
        v-for="(item, index) in propList?.reportList"
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
          fit="cover"
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
            font-size: 16px;
            color: #000;
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
          @click="send(item)"
          style="
            height: 32px;
            padding: 8px;
            color: #fff;
            width: 70px;
            font-size: 14px;
            white-space: nowrap;
            padding: 0;
          "
          >{{ item.isSend ? "再次推送" : "推送" }}
        </van-button>
      </van-grid-item>
    </van-grid>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";
import { ImagePreview, showImagePreview } from "vant";

const props = defineProps(["propList"]);

const emits = defineEmits(["onPush", "onApply"]);

const checkReportImageList = ref([]);
//报告的图片数据转数组
watch(
  () => props.propList.reportList,
  (newVal) => {
    checkReportImageList.value.splice(0);
    if (newVal && newVal && newVal.length) {
      newVal.forEach((element) => {
        checkReportImageList.value.push(element.url);
      });
    }
    console.log(checkReportImageList);
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
const send = (item) => {
  emits("onPush", item);
};

// 申请报告单
const apply = (item, theType) => {
  emits("onApply", { item, theType });
};
</script>
<style lang="scss" scoped>
:deep(.van-grid-item__content) {
  padding: 0 0 10px 0 !important;
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
  max-height: 100%;
  overflow-x: hidden;
  padding: 8px 10px;
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

.apply-div {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  top: 0;
  img {
    width: 100%;
    height: 100%;
  }
}

.apply-tip-box {
  height: 40px;
  background-color: #fef5e7;
  font-size: 14px;
  color: #000;
  margin-bottom: 8px;
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
.icon {
  margin-right: 2px;
}
</style>
