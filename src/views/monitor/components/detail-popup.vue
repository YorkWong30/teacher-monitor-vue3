<template>
  <van-popup
    style="width: 100vw; height: 90vh; background-color: transparent;overflow-x: hidden;"
    :show="show"
    :close-on-click-overlay="false"
    @close="close"
    :style="{ padding: '0px' }"
  >
    <div class="flow-box" v-if="data" v-html="data"></div>
    <div class="close-box x-c">
      <van-icon name="close" color="#ffffff" size="45px" @click="close" />
    </div>
  </van-popup>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";

const props = defineProps({
  data: {
    type: String,
    default: "",
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
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #ffffff;
  border-radius: 6px;
  font-size: 16px;
  text-align: left;
  line-height: 30px;
  padding: 10px;
  box-sizing: border-box;
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
