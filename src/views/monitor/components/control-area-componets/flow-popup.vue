<template>
  <van-popup
    style="width: 100vw; height: 90vh; background-color: transparent"
    :show="show"
    :close-on-click-overlay="false"
    @close="close"
    :style="{ padding: '0px' }"
  >
    <div class="flow-box">
      <div
        class="flow-item"
        v-for="(flow, flowIndex) in workflowChart?.reportList"
        :key="flowIndex"
      >
        <div class="step x-f">
          <span class="bold">阶段 {{ flowIndex + 1 }} </span>
        </div>
        <van-image width="100%" :src="flow?.url">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
        </van-image>
      </div>
    </div>
    <div class="close-box x-c">
      <van-icon name="close" color="#ffffff" size="45px" @click="close" />
    </div>
  </van-popup>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";
import { ImagePreview, showImagePreview } from "vant";

const props = defineProps({
  workflowChart: {
    type: Object,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["update:show"]);

const close = () => {
  emits("update:show", false);
};
</script>
<style lang="scss" scoped>

.flow-box {
  width: 100%;
  height: 90%;
  overflow-y: scroll;
  background-color: #ffffff;
  border-radius: 6px;
  .flow-item {
    width: inherit;
    height: auto;

    .step {
      height: 36px;
      font-size: 20px;
      padding: 0 10px;
    }
  }
}

.close-box {
  width: 100%;
  height: 10%;
}
</style>
