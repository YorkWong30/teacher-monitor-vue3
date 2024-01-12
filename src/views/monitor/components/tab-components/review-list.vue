<template>
  <div class="out-box">
    <div v-for="(item, index) in reviewList" :key="index">
      <div class="note x-bc">
        <div>{{ item.note }}</div>

        <div>
          <van-button
            plain
            size="mini"
            type="primary"
            @click="sendReview(item, 10)"
            >推送
          </van-button>
          <!-- <van-button
            plain
            size="mini"
            type="primary"
            @click="sendReview(item, 20)"
            >推送图片
          </van-button>
          <van-button
            plain
            size="mini"
            type="success"
            @click="sendReview(item, 30)"
            >推送文字
          </van-button> -->
        </div>
      </div>

      <div class="" style="display: flex; justify-content: space-between">
        <div class="v-html" v-html="item.content"></div>
        <div style="flex: 1">
          <van-grid
            :border="false"
            clickable
            column-num="2"
            v-if="item?.reportList && item.reportList.length"
          >
            <van-grid-item
              v-for="(pItem, pIndex) in item?.reportList"
              :key="pItem?.reportId"
            >
              <van-image
                width="100"
                height="100"
                :src="pItem?.url"
                @click="onImage(item, pIndex)"
              >
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
              <div class="more-t">
                {{ pItem?.reportName }}
              </div>
              <!-- <van-button
            size="mini"
            round
            type="default"
            color="#235de6"
            :disabled="item.isSend"
            @click="send(item, index)"
            style="
              height: 32px;
              padding: 5px;
              color: #fff;
              width: 70px;
              font-size: 17px;
              padding: 0;
            "
            >{{ item.isSend ? "已推送" : "推送" }}</van-button
          > -->
            </van-grid-item>
          </van-grid>
        </div>
      </div>
      <van-divider />
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
import { showImagePreview } from "vant";
defineProps(["reviewList"]);

const emits = defineEmits(["onPush", "onSendReview"]);

// 查看报告单
const onImage = (item, pIndex) => {
  console.log(" (item, pIndex) ..", item, pIndex);
  let tempImgArr = [];
  item.reportList.forEach((element) => {
    tempImgArr.push(element.url);
  });
  showImagePreview({
    images: tempImgArr,
    startPosition: pIndex,
    closeable: true,
  });
};

//推送复盘内容
const sendReview = (item, type) => {
  let reportList_temp = [];
  if (item.reportList && item.reportList.length) {
    item.reportList.forEach((r) => {
      reportList_temp.push(r.reportId);
    });
  }
  let obj = {
    diseaseId: undefined,
    reviewId: item.reviewId,
    personId: undefined,
    businessType: type,
    reportIdList: reportList_temp,
  };

  emits("onSendReview", obj);
};
</script>
<style lang="scss" scoped>
.out-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
}
.note {
  font-size: 28px;
  text-align: left;
}
.v-html {
  text-align: left;
  flex-shrink: 0;
  flex: 1;
}
</style>
