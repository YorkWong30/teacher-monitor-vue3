<template>
  <div class="the-box">
    <div class="point">
      <div
        class="point-item"
        v-for="(item, index) in propList?.pointList"
        :key="item?.pointId"
      >
        <span class="blue">要点{{ index + 1 }}:</span>
        <span>{{ item?.point }}</span>
      </div>
    </div>

    <div class="report">
      <van-image
        v-for="(item, index) in propList?.reportList"
        :key="item?.reportId"
        class="img-item"
        :src="item?.url"
      >
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(["propList"]);
</script>
<style lang="scss" scoped>
.the-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 15px 20px;
  box-sizing: border-box;
  overflow-y: auto;
}
.point {
  width: inherit;

  .point-item {
    font-size: 16px;
    text-align: left;
    width: inherit;
    line-height: 30px;
  }
}
.report {
  width: inherit;
  .img-item {
    width: inherit;
  }
}
.blue {
  color: #007fe7;
}
</style>
