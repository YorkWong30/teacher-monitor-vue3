<template>
  <!-- <div class="top-box x-f bold">
    <van-icon name="bullhorn-o" size="25" color="#ffd21e" />
    满分5星，根据学员实际表现打分评价。
  </div> -->
  <div class="key-checklist-box" v-if="checkList && checkList.length">
    <div v-for="(i, index) in checkList" :key="i?.pointId">
      <div class="x-bc bold" style="transition: all 2s">
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
            v-show="i.value >= 1"
            style="
              white-space: nowrap;
              color: lightgray;
              font-size: 14px;
              height: 100%;
            "
            >{{ rateList[i.value - 1] }}</span
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
  height: 35px;
  text-align: left;
  padding: 25px 10px 15px 10px;
  box-sizing: border-box;
  color: #ffd21e;
  font-size: 20px;
}
.key-checklist-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 25px 10px 15px 10px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
