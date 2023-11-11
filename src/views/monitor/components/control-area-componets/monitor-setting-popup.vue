<template>
  <van-popup
    style="width: 100vw; height: 55vh"
    :show="show"
    :style="{ padding: '0px' }"
    closeable
    @close="close"
  >
    <div class="monitor-box">
      <div class="title-box--flow van-hairline--bottom x-c bold">
        <div>心电监护仪参数控制板</div>
      </div>
      <div class="slider-box y-ac">
        <div
          class="slider-item x-bc"
          v-for="(item, index) in sliderObj"
          :key="index"
        >
          <div class="x-c type-title" :style="{ color: item.color }">
            {{ item.typeTitle }}
          </div>
          <div class="x-f">
            <div class="min">{{ item.min }}</div>
            <van-slider
              style="width: 300px; margin: 0 13px"
              :min="item.min"
              :max="item.max"
              v-model="item.value"
              :range="item.isRange"
              active-color="#74C818"
              inactive-color="#D8D8D8"
              bar-height="12px"
              @change="onChange(item, $event)"
            >
              <template #button v-if="!item.isRange">
                <div class="custom-button">{{ item.value }}</div>
              </template>

              <template #left-button v-if="item.isRange">
                <div class="custom-button">
                  {{ item.value[0] }}
                </div>
              </template>

              <template #right-button v-if="item.isRange">
                <div class="custom-button">
                  {{ item.value[[1]] }}
                </div>
              </template>
            </van-slider>
            <div class="max">{{ item.max }}</div>
          </div>
        </div>
      </div>
      <div class="footer-box x-ac">
        <van-button size="small" type="primary" plain @click="close"
          >关闭弹窗</van-button
        >
        <van-button
          :disabled="updateButtonDisabled"
          size="small"
          type="primary"
          @click="update"
          >确定更新</van-button
        >
      </div>
    </div>
  </van-popup>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";
const updateButtonDisabled = ref(true); //是否禁止更新
const monitorData = ref({});
const sliderObj = ref({
  HR: {
    type: "HR",
    typeTitle: "心率",
    color: "#00FF00",
    value: 70,
    min: 0,
    max: 240,
    isRange: false,
  },
  BP: {
    type: "BP",
    typeTitle: "血压",
    color: "#FF0A08",
    value: [20, 80],
    min: 0,
    max: 140,
    isRange: true,
  },
  SpO2: {
    type: "SpO2",
    typeTitle: "氧饱和度",
    color: "#FEFF00",
    value: 100,
    min: 0,
    max: 100,
    isRange: false,
  },
  ETCO2: {
    type: "ETCO2",
    typeTitle: "二氧化碳",
    color: "#FFFFFF",
    value: 60,
    min: 0,
    max: 65,
    isRange: false,
  },
});

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  curCheckList: {
    type: Array,
    default: () => [],
    required: true,
  },
});

watch(
  () => props.show,
  (newVal, oldVal) => {
    updateButtonDisabled.value = true;

    console.log(newVal, oldVal);
    if (props.curCheckList && props.curCheckList.length) {
      for (let key in sliderObj.value) {
        console.log(key + ": " + sliderObj.value[key]);
        //血压要特殊处理
        if (key != "BP") {
          sliderObj.value[key].value = parseInt(
            props.curCheckList.find((element) => {
              return element.item == key;
            }).itemValue
          );
        }
        sliderObj.value.BP.value[0] = parseInt(
          props.curCheckList.find((element) => {
            return element.item == "DBP";
          }).itemValue
        );
        sliderObj.value.BP.value[1] = parseInt(
          props.curCheckList.find((element) => {
            return element.item == "SBP";
          }).itemValue
        );
      }
      console.log("sliderObj.value..", sliderObj.value);
    }
  }
);
const emits = defineEmits(["update:show", "updateMonitor"]);

const close = () => {
  emits("update:show", false);
  updateButtonDisabled.value = true;
};

const update = () => {
  emits("updateMonitor", monitorData.value);
  close();
};

const onChange = () => {
  updateButtonDisabled.value = false;
  for (let key in sliderObj.value) {
    console.log(key + ": " + sliderObj.value[key]);
    //血压要特殊处理
    if (key != "BP") {
      monitorData.value[key] = sliderObj.value[key].value;
    }
  }
  monitorData.value.BP = sliderObj.value.BP.value;
};
</script>
<style lang="scss">
:root {
  --van-popup-close-icon-size: 24px;
  --van-popup-close-icon-margin: 15px;
}
.title-box--flow {
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;
}
.monitor-box {
  width: 100%;
  overflow-y: auto;
  height: 100%;
  border-radius: 6px;
  background-color: #ffffff;
  .slider-box {
    height: calc(100% - 150px);
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    .slider-item {
      width: 100%;
      height: 40px;
    }
  }
  .footer-box {
    width: 100%;
    height: 70px;
    padding: 10px 0;
  }
}
.custom-button {
  width: 32px;
  height: 32px;
  border: 2px solid #74c818;
  line-height: 32px;
  border-radius: 4px;
  color: #74c818;
  font-size: 14px;
  text-align: center;
  background-color: #ffffff;
}
.type-title {
  width: 89px;
  height: 50px;
  background-color: #000000;
  border-radius: 4px;
}

.min,
.max {
  color: rgba($color: #000000, $alpha: 0.65);
  font-size: 14px;
}
</style>
