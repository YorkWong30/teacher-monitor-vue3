<template>
  <div class="evaluate-list-root">
    <!-- <div class="eval-title">{{ evaluation?.title }}</div> -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <table class="score-table">
        <!-- <thead>
          <tr>
            <th class="col-title">评价项</th>
            <th class="col-score">操作评价</th>
          </tr>
        </thead> -->
        <tbody>
          <template v-for="item in evaluationItem" :key="item.evaluationItemId">
            <EvaluationItem :item="item" :scores="scores" :evaluationItemId="item.evaluationItemId"
              :diseaseId="currentDiseaseId" :personId="currentPersonId" :evaluationId="evaluation.evaluationId"
              @hint="onHint" />  
          </template>
        </tbody>
      </table>
    </div>
    <div class="submit-bar" style="display: none;">
      <button class="submit-btn" @click="onSubmit">提交评分</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';

import { useRoute, useRouter } from "vue-router";
import EvaluationItem from './EvaluationItem.vue';
import { queryEvaluation, aiGlassesHint } from '@/api/evaluate';
import { showToast } from 'vant';

const evaluation = ref(null);
const evaluationItem = ref([]);
const scores = reactive({});
// 记录每个任务的 is_prompt 状态，避免下次请求使用过期数据
const isPromptMap = reactive({}); // key: `${sceneIndex}-${taskIndex}` -> 0 | 1
const loading = ref(false);

const props = defineProps({
  evaluation: { type: Object, default: () => ({}) },
  personId: { type: String, default: "" },
})

console.log(props.personId, 'props.personId');


const route = useRoute();
const query = ref(undefined);
const currentPersonId = ref(undefined);
const currentDiseaseId = ref(undefined);
//监听路由参数
watch(
  route,
  (newRoute) => {
    query.value = newRoute.query;
    console.log("item---query.value..", query.value);
    currentPersonId.value = query.value.deviceId;
    currentDiseaseId.value = query.value.diseaseId;
    console.log(currentPersonId.value, 'currentPersonId.value');
    console.log(currentDiseaseId.value, 'currentDiseaseId.value');


  },
  { immediate: true }
);

// 数据转换函数（完全动态，不硬编码）
const convertToTargetFormat = (evaluationData) => {
  const courseInfo = {
    name: evaluationData.evaluation?.title || "",
  };

  const scenes = (evaluationData.evaluationItem || []).map((scene, index) => {
    const sceneId = index + 1;
    const sceneTitle = scene.category || "";
    const coreEvent = scene.description || "";

    const tasks = (scene.childList || []).map((task, taskIndex) => {
      const rawScore = scores[task.evaluationItemId];
      const hasScore = rawScore !== '' && rawScore !== undefined && rawScore !== null;
      const numericScore = hasScore ? Number(rawScore) : NaN;
      const isExecute = hasScore ? 1 : 0;
      // is_correct 根据 evaluationResult（合格=1，不合格=0），由 setScore 写入的分值决定
      const isCorrect = hasScore && numericScore === 1 ? 1 : 0;
      const promptKey = `${index}-${taskIndex}`;
      const correctMsg = task.correctMsg || "";
      const errorMsg = task.errorMsg || "";

      return {
        task_name: task.description || "",
        is_correct: isCorrect,
        is_execute: isExecute,
        is_prompt: isPromptMap[promptKey] ?? 0,
        correct_msg: correctMsg,
        error_msg: errorMsg,
      };
    });

    return {
      scene_id: sceneId,
      scene_title: sceneTitle,
      core_event: coreEvent,
      tasks,
    };
  });

  return {
    course_info: courseInfo,
    deviceId: props.personId,
    scenes,
  };
};

// 暴露给父组件的方法
const handleEvaluationTip = async () => {
  if (!evaluation.value || !evaluationItem.value.length) {
    console.warn('评价数据未加载完成');
    return;
  }

  try {
    const convertedData = convertToTargetFormat({
      evaluation: evaluation.value,
      evaluationItem: evaluationItem.value
    });

    console.log('转换后的数据:', convertedData);

    const response = await aiGlassesHint(convertedData);
    console.log('AI眼镜提示响应:', response);

    if (response && response.code === 1) {
      showToast('提示成功')
      // 合并后端返回的 is_prompt，以免下次继续使用过期数据
      const respData = response.data?.hintMap || {};
      const respScenes = respData.scenes || [];
      respScenes.forEach((scene, sceneIndex) => {
        (scene.tasks || []).forEach((task, taskIndex) => {
          const promptKey = `${sceneIndex}-${taskIndex}`;
          if (task && Object.prototype.hasOwnProperty.call(task, 'is_prompt')) {
            isPromptMap[promptKey] = task.is_prompt;
          }
        });
      });
      console.log('AI眼镜提示发送成功，已同步 is_prompt 状态');
    } else {
      console.error('AI眼镜提示发送失败:', response);
    }
  } catch (error) {
    console.error('调用AI眼镜提示接口失败:', error);
  }
};

// 构建并发送喇叭提示
const onHint = async ({ secret, scope, item }) => {
  console.log('开始构建并发送喇叭提示',secret);
  
  try {
    // 根据暗号与点击范围选择目标集合：F/A -> 当前分组 childList；S -> 当前单项
    const upperSecret = (secret || '').toUpperCase();
    let targetLeafItems = [];
    if (upperSecret === 'F' || upperSecret === 'A' || scope === 'group') {
      targetLeafItems = (item && Array.isArray(item.childList)) ? item.childList : [];
    } else {
      targetLeafItems = item ? [item] : [];
    }

    const tasks = targetLeafItems.map(task => {
      const name = task.description || '';
      if (upperSecret === 'S') {
        return { task_name: name };
      }
      if (upperSecret === 'R') {
        const result = task.result || task.errorMsg || task.correctMsg || '';
        return { task_name: name, result };
      }
      const result = task.result || task.errorMsg || task.correctMsg || '';
      return { task_name: name, result };
    });

    // doctor_action: 仅包含“操作评价正确(=1)”的项目
    let doctorAction = targetLeafItems
      .filter(task => scores[task.evaluationItemId] === 1)
      .map(task => task.description || '');

    // 若为单项 S/R 且该项选择错误(=0)，也加入 doctor_action（去重）
    if ((upperSecret === 'S' || upperSecret === 'R') && scope === 'item' && item) {
      const name = item.description || '';
      const scoreVal = scores[item.evaluationItemId];
      if (name && scoreVal === 0 && !doctorAction.includes(name)) {
        doctorAction = [...doctorAction, name];
      }
    }

    const payload = {
      deviceId: currentPersonId.value || props.personId || '',
      tasks,
      doctor_action: doctorAction,
      secret: upperSecret || 'S'
    };

    const resp = await aiGlassesHint(payload);
    if (resp && resp.code === 1) {
      showToast('已提示');
    } else {
      console.error('喇叭提示失败', resp);
    }
  } catch (e) {
    console.error('喇叭提示异常', e);
  }
};

// 暴露方法给父组件
defineExpose({
  handleEvaluationTip
});

onMounted(async () => {
  loading.value = true;
  try {
    const res = await queryEvaluation({ evaluationId: props.evaluation.evaluationId });
    if (res && res.code === 1 && res.data) {
      evaluation.value = res.data.evaluation;
      evaluationItem.value = res.data.evaluationItem;
      // 初始化分数对象
      const init = (items, sceneIndexStart = 0) => {
        items.forEach((scene, sIdx) => {
          const sceneIndex = sIdx;
          if (scene.childList && scene.childList.length) {
            scene.childList.forEach((task, tIdx) => {
              scores[task.evaluationItemId] = '';
              const key = `${sceneIndex}-${tIdx}`;
              if (isPromptMap[key] === undefined) isPromptMap[key] = 0;
            });
          }
        });
      };
      init(res.data.evaluationItem);
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
  /* min-height: 100vh; */
  background: #fff;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  padding: 6px 8px;
  box-sizing: border-box;
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
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
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
  font-size: 12px;
  line-height: 1.3;
  background: #fff;
  margin: 0 auto 24px auto;
  box-shadow: 0 1px 8px #0001;
}

.score-table thead th {
  background: #f5f7fa;
  font-weight: 600;
  text-align: center;
  padding: 6px 8px;
  border-bottom: 1px solid #ebeef5;
}

.col-title {
  width: 75%;
}

.col-score {
  width: 25%;
  text-align: center;
}

@media (max-width: 900px) {
  .eval-title {
    font-size: 1.5rem;
  }

  .submit-btn {
    font-size: 1.1rem;
    padding: 14px 30px;
  }
}
</style>