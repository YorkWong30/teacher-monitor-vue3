<template>
  <div>
    <div id="box" ref="box">
      <div
        class="bgColor"
        ref="bgColor"
        :style="{ backgroundColor: currentThemeColor }"
      ></div>
      <div class="txt more-t x-c" ref="txt">
        {{ item?.buttonText || "进入下一环节" }}
      </div>
      <!--给i标签添加上相应字体图标的类名即可-->
      <div class="slider" ref="slider">
        <van-icon
          color="#ffffff"
          v-show="!isSuccess"
          ref="icon"
          name="arrow"
          size="25px"
        />
        <van-icon
          :color="currentThemeColor"
          v-show="isSuccess"
          ref="icon"
          name="success"
          size="25px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineEmits, defineProps } from "vue";

const emit = defineEmits(["success"]);
const props = defineProps(["item"]);

const isSuccess = ref(false);
const box = ref(null);
const bgColor = ref(null);
const txt = ref(null);
const slider = ref(null);
const icon = ref(null);
const successMoveDistance = ref(null); //解锁需要滑动的距离
const downX = ref(null); //用于存放鼠标按下时的位置

const currentThemeColor = ref("#007fe7");
if (props.item?.buttonStyle) {
  let stringifyStr = `${props.item?.buttonStyle}`;
  currentThemeColor.value = JSON.parse(stringifyStr).color;
}

onMounted(() => {
  successMoveDistance.value = box.value.offsetWidth - slider.value.offsetWidth; //解锁需要滑动的距离
  //三、给滑块添加鼠标按下事件
  slider.value.onmousedown = mousedownHandler;
  slider.value.ontouchstart = mousedownHandler;

  //初始化 bgColor slider
  bgColor.value.style.backgroundColor = currentThemeColor.value;
  slider.value.style.backgroundColor = currentThemeColor.value;
});
function mousedownHandler(e) {
  bgColor.value.style.transition = "";
  slider.value.style.transition = "";
  var e = e || window.event || e.which;
  downX.value = e.clientX ? e.clientX : e.changedTouches[0].clientX;
  if (!isSuccess.value) {
    //在鼠标按下时，分别给鼠标添加移动和松开事件
    document.onmousemove = mousemoveHandler;
    document.onmouseup = mouseupHandler;
    //添加移动端对应事件
    document.ontouchmove = mousemoveHandler;
    document.ontouchend = mouseupHandler;
  }
}
//四、定义一个获取鼠标当前需要移动多少距离的方法
function getOffsetX(offset, min, max) {
  if (offset < min) {
    offset = min;
  } else if (offset > max) {
    offset = max;
  }
  return offset;
}
//3.1.1鼠标移动事件的方法实现
function mousemoveHandler(e) {
  var e = e || window.event || e.which;
  var moveX = e.clientX ? e.clientX : e.changedTouches[0].clientX;
  console.log(moveX);
  var offsetX = getOffsetX(
    moveX - downX.value,
    0,
    successMoveDistance.value - 8
  );
  if (offsetX > 20) {
    bgColor.value.style.width = offsetX + "px";
  }
  slider.value.style.left = offsetX - 4 + "px";

  if (offsetX == successMoveDistance.value - 8) {
    success();
  }
  //如果不设置滑块滑动时会出现问题（目前还不知道为什么）
  e.preventDefault();
}
//3.1.2鼠标松开事件的方法实现
function mouseupHandler(e) {
  if (!isSuccess.value) {
    bgColor.value.style.width = 0 + "px";
    slider.value.style.left = 4 + "px";
    bgColor.value.style.transition = "width 0.5s linear";
    slider.value.style.transition = "left 0.5s linear";
  }
  document.onmousemove = null;
  document.onmouseup = null;
  //移除移动端事件
  document.ontouchmove = null;
  document.ontouchend = null;
}
//五、定义一个滑块解锁成功的方法
function success() {
  isSuccess.value = true;
  txt.value.innerHTML = "解锁成功";
  txt.value.style.left = "0px";
  txt.value.style.right = "26px";

  bgColor.value.style.backgroundColor = currentThemeColor.value;
  bgColor.value.style.width = "100%";
  bgColor.value.style.borderRadius = "30px";

  slider.value.style.backgroundColor = "#fff";

  //滑动成功时，移除鼠标按下事件和鼠标移动事件
  slider.value.onmousedown = null;
  document.onmousemove = null;
  //移除移动端事件
  document.ontouchstart = null;
  document.ontouchmove = null;
  emit("success", props?.item);
}
</script>

<style lang="scss" scoped>
* {
  touch-action: pan-y;
}

#box {
  position: relative;
  width: 100%;
  height: 60px;
  margin: 0 auto;
  margin-top: 10px;
  background-color: #cdd1da;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  border: 4px solid #f1f3f9;
  box-sizing: border-box;
}
.bgColor {
  position: absolute;
  left: 0;
  top: 0;
  width: 0px;
  height: 52px;
  border-radius: 200px 0 0 200px;
}
.txt {
  position: absolute;
  left: 4.333333vw;
  width: 100%;
  font-weight: bold;
  height: 8.666667vw;
  font-size: 2.166667vw;
  color: #fff;
  /* text-align: center; */
  padding: 0 50px 0 30px;
  box-sizing: border-box;
}
.slider {
  border-radius: 30px;
  position: absolute;
  left: 4px;
  top: 4px;
  width: 44px;
  height: 44px;
  text-align: center;
  cursor: move;
}
.slider > i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
