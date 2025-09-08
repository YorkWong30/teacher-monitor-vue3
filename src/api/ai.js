import axios from 'axios'
import { getToken } from '@/utils/auth'

// AI接口调用
export function getAiAnswer(caseName) {
  const prompt = `你的任务是根据给定的病例名称生成一个情景模拟课程，并以JSON格式输出。课程应包含案例背景介绍以及3个环节，详细且全面地呈现内容。
以下是病例名称：
<病例名称>
${caseName}
</病例名称>
情景模拟课程的具体要求如下：
- 案例背景介绍：对该病例的基本情况（如患者年龄、性别、既往病史等）、常见引发因素等进行简要但具体的介绍，提供足够信息让读者能快速了解病例背景。
- 环节一：病人接诊。详细描述患者到达接诊处时的生命体征（如体温、血压、心率、呼吸等），并清晰说明此环节的任务，例如详细询问病史（包括症状出现的时间、频率、程度等）、进行全面的初步检查（如身体各部位的触诊、听诊等），确保病史采集有对应答案。
- 环节二：根据病情设定，选择为"治疗"或者"辅助检查"。同样详细给出患者当前的生命体征，若选择"治疗"，任务应包含详细制定与实施治疗方案（如使用的药物名称、剂量、给药方式等）；若选择"辅助检查"，任务则是确定需要进行的详细检查项目（如具体的影像学检查、实验室检查等）并安排检查。
- 环节三：根据第二个环节的情况来设置。详细给出患者当前生命体征，若第二环节是"治疗"，此环节可能是详细观察治疗效果（如症状的改善情况、生命体征的变化等）、调整治疗方案（如根据效果增减药物剂量、更换药物等）等；若第二环节是"辅助检查"，此环节则是根据检查结果进行准确诊断和制定详细的治疗计划（如治疗的阶段目标、具体治疗措施等）。

请按照以下JSON格式输出你的内容，确保各部分内容完整、逻辑清晰：
#注意：
1.vitalSigns对象中的字段只能是数字类型，不要有单位！
2.所有任务的description节点中，只能对任务进行描述，不能出现答案。

{
  "caseName": "病例名称",
  "caseBackground": "案例背景介绍",
  "patientInformation": {
    "patientInformation": "患者基本信息",
    "chiefComplaint": "主诉",
    "presentIllness": "现病史",
    "pastMedicalHistory": "既往史",
    "familyHistory": "家族史",
    "medicationHistory": "用药史",
    "allergyHistory": "过敏史",
    "otherInformation": "其他信息"
  },
  "scenes": [
    {
      "scene_id": 1,
      "scene_title": "病人接诊",
      "core_event": "核心事件描述",
      "vitalSigns": {
        "temperature": "体温",
        "pulse": "脉搏",
        "respiratoryRate": "呼吸频率",
        "oxygenSaturation": "血氧饱和度",
        "heartRate": "心率",
        "SBP": "收缩压",
        "DBP": "舒张压",
        "MAP": "平均动脉压",
        "ETCO2": "呼气末二氧化碳"
      },
      "tasks": [
        {
          "taskName": "任务名称",
          "description": "任务描述",
          "taskResult": "任务结果"
        }
      ]
    }
  ]
}`

  return axios({
    url: 'http://8.130.18.64:8083/jhcloud-train/AiChat/getAnswerResult',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: {
      chatType: 20,
      modelName: "",
      knowledgeName: "",
      knowledgeId: "",
      botId: "bot-20250907155524-qfr5m",
      chatQuestionsList: [
        {
          role: "user",
          content: prompt
        }
      ],
      hint: "",
      isKnowledge: 0
    },
    timeout: 990000 
  })
}
