<template>
  <div class="key-checklist-box" v-if="checkList && checkList.length">
    <div style="text-align: left" class="bold">学员关键行为评价说明：</div>
    <div class="top-box x-bc bold">
      <block class="x-bc" v-for="(i, index) in 5" :key="index">
        <block class="y-ac">
          <van-rate
            :model-value="index + 1"
            clearable
            readonly
            :size="14"
            :count="index + 1"
            color="#ffd21e"
            void-icon="star"
            void-color="#eee"
          />
          <span
            class="bold"
            style="
              white-space: nowrap;
              color: lightgray;
              font-size: 12px;
              height: 100%;
              min-height: 20px;
            "
            >{{ rateList[i - 1] }}</span
          >
        </block>
      </block>
    </div>
    <div v-for="(i, index) in checkList" :key="i?.pointId">
      <div class="x-bc bold">
        <div
          style="
            width: 70%;
            max-width: 70%;
            white-space: wrap;
            text-align: left;
            font-size: 18px;
          "
        >
          {{ index + 1 }}.{{ i?.point }}
        </div>
        <div class="y-ac" style="width: 30%; max-width: 30%">
          <van-rate
            v-model="i.value"
            clearable
            :size="26"
            color="#ffd21e"
            void-icon="star"
            void-color="#eee"
          />
          <span
            class="bold"
            style="
              white-space: nowrap;
              color: lightgray;
              font-size: 14px;
              height: 100%;
              min-height: 20px;
            "
            >{{ i.value >= 1 ? rateList[i.value - 1] : "" }}</span
          >
        </div>
      </div>
      <van-divider dashed style="margin: 13px" />
    </div>
  </div>
  <div class="key-checklist-box" v-else>
    <van-empty description="暂未配置" />
  </div>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";
const props = defineProps(["checkList"]);
const theList = ref([]);
watch(
  () => props.checkList,
  (newVal) => {
    theList.value.splice(0);
    if (newVal && newVal && newVal.length) {
      newVal.forEach((element) => {
        element.value = 0;
        theList.value.push(element);
      });
    }
    console.log("theList.value..", theList.value);
  },
  {
    immediate: true,
  }
);

const rateList = ref(["非常差", "差", "一般", "好", "非常好"]);
</script>
<style lang="scss" scoped>
.top-box {
  height: 55px;
  text-align: left;
  padding: 5px 10px 5px 10px;
  box-sizing: border-box;
  color: #ffd21e;
}
.key-checklist-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 10px 10px 15px 10px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
