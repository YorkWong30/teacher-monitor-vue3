<template>
  <div class="step-box x-ac" v-if="renderList && renderList.length">
    <div class="slider-con" v-for="item in renderList" :key="item.workflowId">
      <slider-unlock @success="onSuccess" :item="item"></slider-unlock>

      <!-- <div class="des x-c" style="filter: grayscale(0.4)">
        <div class="more-t">
          <span
            :style="{
              color: item?.buttonStyle
                ? JSON.parse(`${item?.buttonStyle}`).color
                : '#007fe7',
            }"
            >{{ item?.content }}</span
          >
        </div>
      </div> -->
    </div>
  </div>
  <div class="step-box x-c" v-else>流程已结束，老师可进行复盘</div>
</template>
<script setup>
import { getCurrentInstance, ref, watch, defineProps, defineEmits } from "vue";
import { showSuccessToast, showLoadingToast, closeToast } from "vant";
import { imageUrl } from "@/utils/ruoyi";
import sliderUnlock from "./slider-unlock.vue";

//滑动进入下一步
const props = defineProps({
  renderList: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["emitSuccess"]);
const onSuccess = (e) => {
  showLoadingToast({
    message: "推进中...",
    forbidClick: true,
    loadingType: "spinner",
  });
  setTimeout(() => {
    closeToast();
    emit("emitSuccess", e);
  }, 500);
};
</script>
<style lang="scss">
.step-box {
  //padding: 20px;
  background-color: #235de6;
  color: #ffffff;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
}
.slider-con {
  box-sizing: border-box;
  flex: 1;
  max-width: 260px;
  .des {
    width: inherit;
    height: 40px;
    font-size: 14px;
    color: #8c8c8c;
  }
  .blue {
    color: red;
  }
}
</style>
