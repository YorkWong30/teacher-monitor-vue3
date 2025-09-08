import request from "@/utils/request";

//查询急重症列表
export function queryDiseaseList(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/queryDiseaseList",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}
//老师端给学员推送_病例切换
export function teacherPushChangeDisease(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/teacherPushChangeDisease",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}

//老师端给学员推送_推送提示信息
export function teacherPushPrompt(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/teacherPushPrompt",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}

// 新增病例（示例接口，按后端真实路径替换）
export function createDiseaseCase(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/v2/addCase",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data,
  });
}