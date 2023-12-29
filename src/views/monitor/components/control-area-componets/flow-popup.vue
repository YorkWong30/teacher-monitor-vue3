<template>
  <van-popup
    style="width: 100vw; height: 90vh; background-color: transparent"
    :show="show"
    :close-on-click-overlay="false"
    @close="close"
    :style="{ padding: '0px' }"
  >
    <van-tabs class="tab-box" v-model:active="active">
      <van-tab title="案例流程" class="common-box">
        <div
          class="flow-item"
          v-for="(flow, flowIndex) in workflowChart?.reportList"
          :key="flowIndex"
        >
          <!-- <div class="step x-f">
              <span class="bold">阶段 {{ flowIndex + 1 }} </span>
            </div> -->
          <van-image width="100%" :src="flow?.url">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </div>
      </van-tab>
      <van-tab title="案例资料" class="common-box">
        <div style="text-align: left" v-html="disease?.point"></div>
      </van-tab>
    </van-tabs>

    <div class="close-box x-c">
      <van-icon name="close" color="#ffffff" size="45px" @click="close" />
    </div>
  </van-popup>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";

const props = defineProps({
  workflowChart: {
    type: Object,
  },
  disease: {
    type: Object,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["update:show"]);

const active = ref(0);
const close = () => {
  emits("update:show", false);
};
</script>
<style lang="scss">
.van-tabs__content {
  height: calc(100% - var(--van-tabs-line-height));
}
.tab-box {
  width: 100%;
  height: 90%;
  background-color: #ffffff;
  overflow: hidden;
}

.common-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #ffffff;
  padding: 10px 5px;
  box-sizing: border-box;
}
.flow-item {
  width: inherit;
  height: auto;

  .step {
    height: 36px;
    font-size: 20px;
    padding: 0 10px;
  }
}

.close-box {
  width: 100%;
  height: 10%;
}
</style>
