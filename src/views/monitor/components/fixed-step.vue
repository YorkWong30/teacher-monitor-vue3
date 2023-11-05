<template>
  <div class="step-box x-ac">
    <div class="slider-con" v-for="item in 2" :key="item">
      <div class="des x-c">
        <div class="more-t">
          <span>下个环节：</span>
          <span class="blue">病情将持续恶化</span>
        </div>
      </div>
      <slider-unlock @success="success" :item="item"></slider-unlock>
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance, ref, watch } from "vue";
import { imageUrl } from "@/utils/ruoyi";
import sliderUnlock from "./slider-unlock.vue";

//滑动进入下一步
const success = (e) => {
  console.log("e..", e);
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
    color: #007fe7;
  }
}
</style>
