<template>
  <div class="add-case-box">
    <van-nav-bar title="医学模拟" border left-arrow @click-left="goBack" />
    <div class="scroll-box">

      <div class="page-tip">填写以下信息，将为您生成案例，即刻运行</div>

      <div class="case-name">
        <div class="case-name-wrapper">
          <van-field v-model="formBackground.caseName" placeholder="请输入案例名称" class="large-field" />
          <div class="ai-button" @click="showAiDialog">
            <div class="ai-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" />
                <path d="M19 15L19.74 17.74L22.5 18.5L19.74 19.26L19 22L18.26 19.26L15.5 18.5L18.26 17.74L19 15Z"
                  fill="currentColor" />
                <path d="M5 6L5.5 7.5L7 8L5.5 8.5L5 10L4.5 8.5L3 8L4.5 7.5L5 6Z" fill="currentColor" />
              </svg>
            </div>
            <span>一键生成</span>
          </div>
        </div>
      </div>

      <div class="steps-tabs x-ac">
        <van-button v-for="(tab, idx) in tabs" :key="tab.key" size="mini"
          :type="currentStep === idx ? 'primary' : 'default'" @click="switchStep(idx)"
          style="margin-right: 8px; position: relative;">
          {{ renderTabLabel(tab) }}
          <van-icon v-if="canEditTab(tab)" name="edit" size="20" style="margin-left: 2px;"
            @click.stop="openEdit(tab)" />
        </van-button>
      </div>

      <div class="step-panel">
        <!-- 病例背景 -->
        <CaseBackground v-if="currentStep === 0" v-model="formBackground" />

        <!-- 接诊与体检 -->
        <AdmissionExamination v-else-if="currentStep === 1" v-model="formAdmission" />

        <!-- 检查 -->
        <PatientExamination v-else-if="currentStep === 2" v-model="formExamination" />

        <!-- 诊断治疗 -->
        <DiagnosisTreatment v-else v-model="formTreatment" />
      </div>

    </div>
    <div class="footer-actions x-bc">
      <van-button type="default" size="mini" block :disabled="currentStep === 0" @click="prevStep">上一步</van-button>
      <van-button size="mini" block v-if="currentStep < tabs.length - 1" type="primary"
        @click="nextStep">下一步</van-button>
      <van-button size="mini" block v-else type="primary" @click="submitAll" :loading="submitting">完成</van-button>
    </div>

    <!-- AI弹窗 -->
    <van-popup v-model:show="showAi" :close-on-click-overlay="false" class="ai-popup">
      <div class="ai-popup-content">
        <div class="ai-header">
          <div class="ai-avatar">
            <div class="ai-pulse"></div>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" />
              <path d="M19 15L19.74 17.74L22.5 18.5L19.74 19.26L19 22L18.26 19.26L15.5 18.5L18.26 17.74L19 15Z"
                fill="currentColor" />
              <path d="M5 6L5.5 7.5L7 8L5.5 8.5L5 10L4.5 8.5L3 8L4.5 7.5L5 6Z" fill="currentColor" />
            </svg>
          </div>
          <h3>AI一键生成病例</h3>
        </div>
        <div class="ai-messages">
          <div v-for="(message, index) in aiMessages" :key="index" class="ai-message">
            <div class="message-content">
              <span class="message-text">{{ message.text }}</span>
              <div v-if="message.loading" class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div v-else>
                <van-icon name="success" color="#235de6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 编辑步骤名称弹窗 -->
    <van-dialog v-model:show="editNameDialog.show" title="编辑步骤名称" show-cancel-button
      :before-close="(action) => { if (action === 'confirm') { confirmEditName(); } else { editNameDialog.show = false; } }">
      <div style="padding: 12px 16px;">
        <van-field v-model="editNameDialog.tempName" placeholder="请输入步骤名称" />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { createDiseaseCase } from "@/api/caseList";
import { getAiAnswer } from "@/api/ai";
import CaseBackground from "./addNewCaseComponent/CaseBackground.vue";
import AdmissionExamination from "./addNewCaseComponent/AdmissionExamination.vue";
import PatientExamination from "./addNewCaseComponent/PatientExamination.vue";
import DiagnosisTreatment from "./addNewCaseComponent/DiagnosisTreatment.vue";
import {
  showToast,
  showLoadingToast,
  closeToast,
  showSuccessToast,
  showFailToast,
  showConfirmDialog,
} from "vant";

const router = useRouter();

const tabs = [
  { key: "background", label: "案例背景" },
  { key: "admission", label: "病人接诊" },
  { key: "examination", label: "辅助检查" },
  { key: "treatment", label: "诊断与治疗" },
];

// 可编辑步骤名称（默认值）
const stepNames = ref({
  consultationAndPhysicalExamination: "病人接诊",
  patientExamination: "辅助检查",
  diagnosisAndTreatment: "诊断与治疗",
});

// 编辑弹窗状态
const editNameDialog = ref({
  show: false,
  key: '', // 映射到 stepNames 的 key
  tempName: '',
});

const tabKeyToStepKey = (tabKey) => {
  if (tabKey === 'admission') return 'consultationAndPhysicalExamination';
  if (tabKey === 'examination') return 'patientExamination';
  if (tabKey === 'treatment') return 'diagnosisAndTreatment';
  return '';
};

const renderTabLabel = (tab) => {
  const stepKey = tabKeyToStepKey(tab.key);
  if (!stepKey) return tab.label;
  return stepNames.value[stepKey] || tab.label;
};

const canEditTab = (tab) => {
  return tab.key === 'admission' || tab.key === 'examination' || tab.key === 'treatment';
};

const openEdit = (tab) => {
  const stepKey = tabKeyToStepKey(tab.key);
  if (!stepKey) return;
  editNameDialog.value.key = stepKey;
  editNameDialog.value.tempName = stepNames.value[stepKey];
  editNameDialog.value.show = true;
};

const confirmEditName = () => {
  const { key, tempName } = editNameDialog.value;
  if (key && tempName && tempName.trim()) {
    stepNames.value[key] = tempName.trim();
  }
  editNameDialog.value.show = false;
};

const currentStep = ref(0);
const switchStep = (idx) => {
  currentStep.value = idx;
};
const nextStep = () => {
  if (currentStep.value < tabs.length - 1) currentStep.value += 1;
};
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value -= 1;
};
const goBack = () => router.back();

// AI相关状态
const showAi = ref(false);
const aiMessages = ref([]);

// 各环节独立表单模型（案例背景按设计图字段）
const formBackground = ref({
  caseName: "",
  patientInfo: "",
  chiefComplaint: "",
  presentIllness: "",
  pastHistory: "",
  familyHistory: "",
  medicationHistory: "",
  allergyHistory: "",
  otherInfo: "",
});
const formAdmission = ref({
  vitals: { t: "", p: "", r: "", spo2: "", hr: "", bp: [110, 70], ecot2: "", other: "" },
  tasks: [{ name: "", result: "", status: "editing", description: "", }],
});
const formExamination = ref({
  vitals: { t: "", p: "", r: "", spo2: "", hr: "", bp: [110, 70], ecot2: "", other: "" },
  tasks: [{ name: "", result: "", status: "editing", description: "", }],
});
const formTreatment = ref({
  vitals: { t: "", p: "", r: "", spo2: "", hr: "", bp: [110, 70], ecot2: "", other: "" },
  tasks: [{ name: "", result: "", status: "editing", description: "", }],
});

const submitting = ref(false);

// AI相关方法
const showAiDialog = async (text) => {
  console.log("showAiDialog....", text);
  // 校验
  if (!formBackground.value.caseName) {
    showToast({
      message: '请填写病例名称',
      position: 'top',
    });
    return;
  }

  showAi.value = true;
  aiMessages.value = [];

  // 添加消息并模拟动画效果
  const addMessage = (text, loading = false) => {
    aiMessages.value.push({ text, loading });
  };

  // 模拟打字机效果
  const typeWriter = (text, index = 0) => {
    return new Promise((resolve) => {
      if (index < text.length) {
        setTimeout(() => {
          aiMessages.value[aiMessages.value.length - 1].text = text.substring(0, index + 1);
          typeWriter(text, index + 1).then(resolve);
        }, 50);
      } else {
        resolve();
      }
    });
  };

  // 处理AI响应数据
  const processAiResponse = (data) => {
    try {
      if (data && data.patientInformation) {
        // 填充案例背景信息
        formBackground.value.patientInfo = data.patientInformation.patientInformation || "";
        formBackground.value.chiefComplaint = data.patientInformation.chiefComplaint || "";
        formBackground.value.presentIllness = data.patientInformation.presentIllness || "";
        formBackground.value.pastHistory = data.patientInformation.pastMedicalHistory || "";
        formBackground.value.familyHistory = data.patientInformation.familyHistory || "";
        formBackground.value.medicationHistory = data.patientInformation.medicationHistory || "";
        formBackground.value.allergyHistory = data.patientInformation.allergyHistory || "";
        formBackground.value.otherInfo = data.patientInformation.otherInformation || "";
      }

      // 处理场景数据
      if (data.scenes && data.scenes.length > 0) {
        // 处理第一个场景（接诊与体检）
        if (data.scenes[0] && data.scenes[0].vitalSigns) {
          const vitals = data.scenes[0].vitalSigns;

          formAdmission.value.vitals = {
            t: vitals.temperature || "",
            p: vitals.pulse || "",
            r: vitals.respiratoryRate || "",
            spo2: vitals.oxygenSaturation || "",
            hr: vitals.heartRate || "",
            bp: [vitals.SBP || 110, vitals.DBP || 70],
            ecot2: vitals.ETCO2 || 45,
            other: ""
          };
        }

        if (data.scenes[0] && data.scenes[0].tasks) {
          formAdmission.value.tasks = data.scenes[0].tasks.map(task => ({
            name: task.taskName || "",
            result: task.taskResult || "",
            description: task.description || "",
            status: "editing"
          }));
        }

        // 处理第二个场景（辅助检查）
        if (data.scenes[1] && data.scenes[1].vitalSigns) {
          const vitals = data.scenes[1].vitalSigns;
          formExamination.value.vitals = {
            t: vitals.temperature || "",
            p: vitals.pulse || "",
            r: vitals.respiratoryRate || "",
            spo2: vitals.oxygenSaturation || "",
            hr: vitals.heartRate || "",
            bp: [vitals.SBP || 110, vitals.DBP || 70],
            ecot2: vitals.ETCO2 || 45,
            other: ""
          };
        }

        if (data.scenes[1] && data.scenes[1].tasks) {
          formExamination.value.tasks = data.scenes[1].tasks.map(task => ({
            name: task.taskName || "",
            result: task.taskResult || "",
            description: task.description || "",
            status: "editing"
          }));
        }

        // 处理第三个场景（诊断治疗）
        if (data.scenes[2] && data.scenes[2].vitalSigns) {
          const vitals = data.scenes[2].vitalSigns;
          formTreatment.value.vitals = {
            t: vitals.temperature || "",
            p: vitals.pulse || "",
            r: vitals.respiratoryRate || "",
            spo2: vitals.oxygenSaturation || "",
            hr: vitals.heartRate || "",
            bp: [vitals.SBP || 110, vitals.DBP || 70],
            ecot2: vitals.ETCO2 || 45,
            other: ""
          };
        }

        if (data.scenes[2] && data.scenes[2].tasks) {
          formTreatment.value.tasks = data.scenes[2].tasks.map(task => ({
            name: task.taskName || "",
            result: task.taskResult || "",
            description: task.description || "",
            status: "editing"
          }));
        }


        console.log('data...', data);

      }
    } catch (error) {
      console.error('处理AI响应数据失败:', error);
    }
  };

  // 开始AI处理流程
  try {
    addMessage("病例检索中", true);

    // 短暂延迟后显示下一步
    setTimeout(() => {
      addMessage("病例生成中", true);
      aiMessages.value[0].loading = false;

      setTimeout(() => {
        addMessage("患者数据生成中", true);
        aiMessages.value[1].loading = false;
      }, 6000);

    }, 6000);

    console.log('立即调用AI接口');

    // 立即调用AI接口
    const response = await getAiAnswer(formBackground.value.caseName);



    // 处理AI响应
    if (response && response.data) {
      console.log(response.data);

      // 尝试解析AI返回的JSON数据
      try {
        let aiData;
        if (typeof response.data.data.answer === 'string') {
          aiData = JSON.parse(response.data.data.answer);
          console.log('aiData', aiData);


        } else {
          aiData = response.data;
        }
        // 立即显示完成状态
        setTimeout(() => {
          addMessage("AI生成完成！", false);
          aiMessages.value[2].loading = false;
        }, 500);
        processAiResponse(aiData);

        //复位
        currentStep.value = 0



        // 2秒后关闭弹窗
        setTimeout(() => {
          showAi.value = false;
        }, 1500);

      } catch (parseError) {
        console.error('解析AI响应失败:', parseError);
        // 显示错误提示
        showFailToast({
          message: '网络错误，重试中...',
          duration: 1800
        });

        // 3秒后关闭弹窗
        setTimeout(() => {
          showAi.value = false;
        }, 1000);

        // 3秒后关闭弹窗
        setTimeout(() => {
          showAiDialog('重试中')
        }, 1800);
      }
    }
  } catch (error) {
    console.error('error:', error);
    // 显示错误提示
    showFailToast({
      message: 'AI处理失败，请检查网络连接后重试',
      duration: 1800
    });


    // 3秒后关闭弹窗
    setTimeout(() => {
      showAi.value = false;
    }, 1000);

    // 3秒后关闭弹窗
    setTimeout(() => {
      showAiDialog('catch重试中')
    }, 1800);
  }
};

const submitAll = () => {
  // 案例名称是必须要输入的。
  if (!formBackground.value.caseName) {
    showFailToast({
      message: "请输入案例名称",
      duration: 2000
    });
    return;
  }

  // 显示确认弹窗
  showConfirmDialog({
    title: '确认保存',
    message: `确定保存病例【${formBackground.value.caseName}】吗？`,
    confirmButtonText: '确定保存',
    cancelButtonText: '取消',
  }).then(() => {
    // 用户确认后执行保存
    performSave();
  }).catch(() => {
    // 用户取消
    console.log('用户取消保存');
  });
};

const performSave = () => {
  const toNumberOrNull = (val) => {
    if (val === undefined || val === null || val === "") return null;
    const n = typeof val === "number" ? val : parseFloat(val);
    return Number.isFinite(n) ? n : null;
  };

  const mapVitals = (v) => ({
    temperature: toNumberOrNull(v.t),
    pulse: toNumberOrNull(v.p),
    heartRate: toNumberOrNull(v.hr),
    respiratoryRate: toNumberOrNull(v.r),
    oxygenSaturation: toNumberOrNull(v.spo2),
    SBP: Array.isArray(v.bp) ? toNumberOrNull(Math.max(v.bp[0] || 0, v.bp[1] || 0)) : 70,
    DBP: Array.isArray(v.bp) ? toNumberOrNull(Math.min(v.bp[0] || 0, v.bp[1] || 0)) : 110,
    // 平均动脉压 (MAP) = 舒张压 (DBP) + 1/3 * 脉压 (SBP-DBP) 
    MAP: Array.isArray(v.bp) ? toNumberOrNull(v.bp[0] + (v.bp[1] - v.bp[0]) / 3) : 80,
    ETCO2: toNumberOrNull(v.ecot2),
    otherVitalSigns: v.other || "",
  });

  const mapTasks = (tasks) =>
    (tasks || [])
      .filter((t) => (t.name && t.name.trim()) || (t.result && t.result.trim()))
      .map((t) => ({ taskName: t.name || "", taskResult: t.result || "", taskDescription: t.description || "" }));

  const payload = {
    caseName: formBackground.value.caseName || "",
    caseBackground: {
      patientInformation: formBackground.value.patientInfo || "",
      chiefComplaint: formBackground.value.chiefComplaint || "",
      presentIllness: formBackground.value.presentIllness || "",
      pastMedicalHistory: formBackground.value.pastHistory || "",
      familyHistory: formBackground.value.familyHistory || "",
      medicationHistory: formBackground.value.medicationHistory || "",
      allergyHistory: formBackground.value.allergyHistory || "",
      otherInformation: formBackground.value.otherInfo || "",
    },
    consultationAndPhysicalExamination: {
      workflowName: stepNames.value.consultationAndPhysicalExamination,
      vitalSigns: mapVitals(formAdmission.value.vitals || {}),
      tasks: mapTasks(formAdmission.value.tasks || []),
    },
    patientExamination: {
      workflowName: stepNames.value.patientExamination,
      vitalSigns: mapVitals(formExamination.value.vitals || {}),
      tasks: mapTasks(formExamination.value.tasks || []),
    },
    diagnosisAndTreatment: {
      workflowName: stepNames.value.diagnosisAndTreatment,
      vitalSigns: mapVitals(formTreatment.value.vitals || {}),
      tasks: mapTasks(formTreatment.value.tasks || []),
    },
  };
  submitting.value = true;
  createDiseaseCase(payload)
    .then(() => {
      submitting.value = false;
      // 显示成功弹窗
      showSuccessToast({
        message: '病例保存成功！',
        duration: 2000,
        onClose: () => {
          // 弹窗关闭后回退一页
          router.back();
        }
      });
    })
    .catch((error) => {
      submitting.value = false;
      // 显示失败弹窗
      showFailToast({
        message: '病例保存失败，请重试',
        duration: 1800
      });
      console.error('保存病例失败:', error);
    });
};

onMounted(() => { });
</script>
<style lang="scss">
:root {
  --van-nav-bar-background: #235de6;
}

.add-case-box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
}

.scroll-box {
  height: calc(100vh - 150px);
  overflow-y: auto;
}

.van-nav-bar__title {
  color: #ffffff;
  font-size: 22px;
}

.van-field__body {
  background-color: #f2f3f5;
  padding: 10px 12px;
  height: auto;
  border-radius: 6px;
}

.steps-tabs {
  background: #ffffff;
  padding: 12px 16px;
}

.step-panel {
  background: #ffffff;
  padding: 10px 0;
}

.footer-actions {
  position: fixed;
  background-color: #235DE6;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px 30px;
  box-sizing: border-box;
}

.page-tip {
  text-align: center;
  color: #007FE7;
  padding: 12px 0;
}

.case-name {
  padding: 0 16px 8px 16px;
}

.case-name-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #235de6 0%, #1a89fa 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  animation: slideIn 0.3s ease-out;
  white-space: nowrap;
}

.ai-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ai-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-icon svg {
  width: 14px;
  height: 14px;
  animation: sparkle 2s infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes sparkle {

  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.1) rotate(180deg);
  }
}

/* AI弹窗样式 */
.ai-popup {
  background: white;
  border-radius: 16px;
}

.ai-popup-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  width: 90vw;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.ai-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #235de6 0%, #1a89fa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.ai-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #235de6;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.ai-avatar svg {
  width: 20px;
  height: 20px;
  animation: float 3s ease-in-out infinite;
}

.ai-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.ai-messages {
  max-height: 200px;
  overflow-y: auto;
}

.ai-message {
  margin-bottom: 12px;
  animation: fadeInUp 0.5s ease-out;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  box-sizing: border-box;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #235de6;
}

.message-text {
  font-size: 12px;
  color: #333;
  line-height: 1.2;
}

.loading-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: #235de6;
  border-radius: 50%;
  animation: loadingDot 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-3px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes loadingDot {

  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.large-field .van-field__body {
  border-radius: 8px;
}

/* 收紧 placeholder 与文本字号、行高并允许换行 */
.large-field .van-field__control,
.van-field__control {
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-word;
}

.large-field .van-field__control::placeholder,
.van-field__control::placeholder {
  font-size: 12px;
  line-height: 18px;
  color: #9aa0a6;
}

.van-popup--center {
  background-color: #fff;
}

.van-toast__text {

  color: #000;
}


.van-dialog {
  background-color: #ffffff !important;
}
</style>
