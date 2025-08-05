<template>
  <div class="evaluate-list-root">
    <div class="eval-title">{{ evaluation?.title }}</div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <table class="score-table">
        <thead>
          <tr>
            <th class="col-title">评价项</th>
            <th class="col-score">操作评价</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in evaluationItem" :key="item.evaluationItemId">
            <EvaluationItem :item="item" :scores="scores" />
          </template>
        </tbody>
      </table>
    </div>
    <div class="submit-bar">
      <button class="submit-btn" @click="onSubmit">提交评分</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import EvaluationItem from './EvaluationItem.vue';
import { queryEvaluation } from '@/api/evaluate';

const evaluation = ref(null);
const evaluationItem = ref([]);
const scores = reactive({});
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await queryEvaluation({ evaluationId: 1 });
    if (res && res.code === 1 && res.data) {
      evaluation.value = res.data.evaluation;
      evaluationItem.value = res.data.evaluationItem;
      // 初始化分数对象
      const initScores = (items) => {
        items.forEach(item => {
          if (item.childList && item.childList.length) {
            initScores(item.childList);
          } else {
            scores[item.evaluationItemId] = '';
          }
        });
      };
      initScores(res.data.evaluationItem);
    }
  } finally {
    loading.value = false;
  }
});

function onSubmit() {
  const missing = Object.entries(scores).filter(([k, v]) => v === '' || v === null || v === undefined);
  if (missing.length) {
    alert('请填写所有评分项');
    return;
  }
  const submitData = Object.entries(scores).map(([evaluationItemId, score]) => ({ evaluationItemId, score: Number(score) }));
  alert('评分已提交！');
  // console.log('提交数据', submitData);
}
</script>

<style scoped>
.evaluate-list-root {
  min-height: 100vh;
  background: #f6f7fb;
  padding-bottom: 90px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}
.eval-title {
  font-size: 2.1rem;
  font-weight: bold;
  text-align: center;
  padding: 12px 0 18px 0;
  box-sizing: border-box;
  color: #234;
  letter-spacing: 1px;
}
.loading {
  text-align: center;
  font-size: 1.3rem;
  color: #888;
  margin-top: 40px;
}
.eval-group-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 12px;
}
.submit-bar {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 -2px 12px #0001;
  padding: 18px 0 18px 0;
  display: flex;
  justify-content: center;
  z-index: 10;
}
.submit-btn {
  background: linear-gradient(90deg, #3a7afe 0%, #235de6 100%);
  color: #fff;
  font-size: 1.4rem;
  font-weight: bold;
  border: none;
  border-radius: 32px;
  padding: 16px 60px;
  box-shadow: 0 2px 8px #235de633;
  cursor: pointer;
  letter-spacing: 2px;
  transition: background 0.2s;
}
.submit-btn:active {
  background: #235de6;
}
.score-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 1.4;
  background: #fff;
  margin: 0 auto 32px auto;
  box-shadow: 0 2px 12px #0001;
}
.score-table thead th {
  background: #fafafa;
  font-weight: 600;
  text-align: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e8e8e8;
}
.col-title {
  width: 70%;
}
.col-score {
  width: 30%;
  text-align: center;
}
@media (max-width: 900px) {
  .eval-title { font-size: 1.5rem; }
  .submit-btn { font-size: 1.1rem; padding: 14px 30px; }
}
</style>