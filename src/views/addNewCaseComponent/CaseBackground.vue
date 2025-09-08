<!-- 案例背景 -->
<template>
  <div class="case-background">
    <div class="bg-item">
      <div class="item-head"><span>1、</span>患者信息</div>
      <van-field v-model="formData.patientInfo" type="textarea"
        :autosize="{ minHeight: 84, maxHeight: 180 }" rows="3"
        placeholder="姓名、性别、年龄、职业、婚姻情况等&#10;个人生活习惯（吸烟、饮酒史）、职业与环境、治游史等" class="card-textarea" />
    </div>

    <div class="bg-item">
      <div class="item-head"><span>2、</span>主诉</div>
      <van-field v-model="formData.chiefComplaint" type="textarea"
        :autosize="{ minHeight: 84, maxHeight: 160 }" rows="3" placeholder="患者感受最痛苦的主要症状（或体征）及其持续时间"
        class="card-textarea" />
    </div>

    <div class="bg-item">
      <div class="item-head"><span>3、</span>现病史</div>
      <van-field v-model="formData.presentIllness" type="textarea"
        :autosize="{ minHeight: 140, maxHeight: 300 }" rows="5"
        placeholder="围绕主诉展开，详细描述疾病的发生、发展、诊疗全过程。&#10;包括：起病情况（时间、地点、诱因、缓急）、主要症状的特点、病情的发展与演变、伴随症状、有鉴别意义的阴性症状、诊疗经过（是否在院外治疗过及效果）、发病以来的一般情况（精神、食欲、睡眠、大小便、体重变化等）。"
        class="card-textarea" />
    </div>

    <div class="bg-item">
      <div class="item-head"><span>4、</span>既往史</div>
      <van-field v-model="formData.pastHistory" type="textarea"
        :autosize="{ minHeight: 84, maxHeight: 180 }" rows="3"
        placeholder="既往健康状况、疾病史（特别是高血压、糖尿病、心脏病等慢性病）、传染病史、预防接种史、手术史、外伤史、输血史。" class="card-textarea" />
    </div>

    <div class="bg-item">
      <div class="item-head"><span>5、</span>家族史</div>
      <van-field v-model="formData.familyHistory" type="textarea"
        :autosize="{ minHeight: 84, maxHeight: 180 }" rows="3" placeholder="父母、兄弟姐妹及子女的健康状况，有无与患者类似的疾病或遗传性疾病。"
        class="card-textarea" />
    </div>

    <div class="bg-item">
      <div class="item-head"><span>6、</span>用药史</div>
      <van-field v-model="formData.medicationHistory" type="textarea"
        :autosize="{ minHeight: 84, maxHeight: 180 }" rows="3" placeholder="长期服用的药物，包括处方药、非处方药、保健品等"
        class="card-textarea" />
    </div>

    <div class="bg-item">
      <div class="item-head"><span>7、</span>过敏史</div>
      <van-field v-model="formData.allergyHistory" type="textarea"
        :autosize="{ minHeight: 84, maxHeight: 180 }" rows="3" placeholder="明确的药物、食物或其他物质过敏史"
        class="card-textarea" />
    </div>

    <div class="bg-item">
      <div class="item-head"><span>8、</span>其他信息</div>
      <van-field v-model="formData.otherInfo" type="textarea" :autosize="{ minHeight: 64, maxHeight: 160 }"
        rows="2" placeholder="其他补充信息" class="card-textarea" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      patientInfo: "",
      chiefComplaint: "",
      presentIllness: "",
      pastHistory: "",
      familyHistory: "",
      medicationHistory: "",
      allergyHistory: "",
      otherInfo: "",
    })
  }
});

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});
</script>

<style lang="scss" scoped>
.bg-item {
  padding: 0 16px 16px 16px;
}

.item-head {
  padding: 0 30px;
  box-sizing: border-box;
  text-align: left;
  font-size: 15px;
  color: #333333;
}

.card-textarea {
  :deep(.van-field__body) {
    background: #f7f8fa;
    border-radius: 8px;
    padding: 10px 12px;
    max-height: 220px;
    overflow-y: auto;
  }

  :deep(.van-field__control) {
    font-size: 14px;
    line-height: 20px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  :deep(.van-field__control::placeholder) {
    font-size: 12px;
    line-height: 18px;
    color: #9aa0a6;
  }
}
</style>
