<template>
  <div class="step-box x-ac" v-if="renderList && renderList.length">
    <div class="slider-con" v-for="item in renderList" :key="item.workflowId">
      <div class="des x-c">
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
      </div>
      <slider-unlock @success="onSuccess" :item="item"></slider-unlock>
    </div>
  </div>
  <div class="step-box x-c" v-else>训练结束✅</div>
</template>
<script setup>
import { getCurrentInstance, ref, watch, defineProps } from "vue";
import { showSuccessToast } from "vant";
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
  setTimeout(() => {
    console.log("e..", e);
    emit("emitSuccess", e);
  }, 500);
};
</script>
<style lang="scss">
.step-box {
  padding: 20px;
  background-color: #e4e9f3;
  box-sizing: border-box;
  width: 100%;
  height: 140px;
  gap: 20px;
}
.slider-con {
  box-sizing: border-box;
  flex: 1;
  max-width: 250px;
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
