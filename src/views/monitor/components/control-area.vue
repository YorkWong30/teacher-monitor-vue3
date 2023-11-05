<template>
  <div class="control-box">
    <van-row gutter="10">
      <van-col span="4">
        <div class="common-col head">
          <img :src="imageUrl('head.png')" mode="scaleToFill" />
          <div class="id white">ID.12490</div>
        </div>
      </van-col>
      <van-col span="8">
        <div class="common-col monitor x-ac">
          <img :src="imageUrl('monitor.png')" mode="scaleToFill" />
          <div class="y-ac" style="height: 90%; box-sizing: border-box">
            <div class="f14">心电监护仪</div>
            <div class="x-f">
              <van-switch
                v-model="monitorIsOpen"
                active-color="#74C818"
                inactive-color="#000000"
                size="15px"
              />
              <span style="margin-left: 5px">设置</span>
            </div>
          </div>
        </div>
      </van-col>
      <van-col span="4">
        <div class="common-col common-control flow y-bc" @click="preview()">
          <div class="white f14">案例流程</div>
          <img :src="imageUrl('flow.png')" mode="scaleToFill" /></div
      ></van-col>
      <van-col span="4" @click="doCheckShow">
        <div class="common-col common-control flow y-bc">
          <div class="white f14">辅助检查</div>
          <img :src="imageUrl('assist.png')" mode="scaleToFill" /></div
      ></van-col>
      <van-col span="4">
        <div class="common-col common-control flow y-bc">
          <div class="white f14">模拟重置</div>
          <img :src="imageUrl('reset.png')" mode="scaleToFill" /></div
      ></van-col>
    </van-row>
    <div class="second-box">
      <div class="title-box van-hairline--bottom x-f">
        <div class="one-t">请引导学员完成以下步骤</div>
      </div>
      <div class="list-box">
        <div class="list-item" v-for="item in 5" :key="item">
          1.病史采集病史采集病史采集病史采集病史采集病史采集病史采集病史采集病史采集病史采集
        </div>
      </div>
    </div>

    <!-- 辅助检查弹框 -->
    <van-popup
      style="width: 100vw; height: 80vh; border-radius: 6px"
      v-model:show="showCheckPopup"
      :style="{ padding: '64px' }"
    >
      <div>内容内容内容</div>
    </van-popup>
  </div>
</template>
<script setup>
import { getCurrentInstance, ref, watch } from "vue";
import { ImagePreview, showImagePreview } from "vant";
import { imageUrl } from "@/utils/ruoyi";
const monitorIsOpen = ref(false); //monitor是否开启
console.log("imageUrl..", imageUrl);
const showCheckPopup = ref(false);
//查看流程
const preview = () => {
  showImagePreview([
    "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",
    "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg",
  ]);
};

//查看辅助检查报告
const doCheckShow = () => {
  showCheckPopup.value = true;
};
</script>
<style lang="scss">
:root {
  --van-switch-width: 30px;
}
.control-box {
  width: 100%;
  height: 343px;
  padding: 0 10px;
  box-sizing: border-box;
  background-color: #235de6;
}
.common-col {
  height: 80px;
  width: 100%;
}

.head {
  img {
    width: 53px;
    height: 53px;
    border-radius: 24px;
  }
  .id {
    font-size: 14px;
  }
}
.monitor {
  color: #fff;
  background-color: rgba($color: #000000, $alpha: 0.35);
  border-radius: 8px;
  img {
    width: 75px;
    height: 65px;
  }
}

.common-control {
  background-color: rgba($color: #000000, $alpha: 0.35);
  border-radius: 8px;
  height: 80px;
  box-sizing: border-box;
  padding: 10px 0 8px 0;
  margin: 0 auto;
  img {
    width: 50px;
    height: 36px;
  }
}

.second-box {
  width: 100%;
  height: 233px;
  background-color: #ffffff;
  border-radius: 6px;
  margin: 10px 0;
  box-sizing: border-box;
  .title-box {
    padding: 5px 20px;

    box-sizing: border-box;
    width: 100%;
    height: 56px;
    line-height: 20px;
    text-align: left;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
  }
  .list-box {
    height: calc(100% - 56px);
    overflow-y: auto;
    padding: 10px 20px;
    box-sizing: border-box;

    .list-item {
      color: #000;
      font-size: 16px;
      line-height: 26px;
      text-align: left;
    }
  }
}
</style>
