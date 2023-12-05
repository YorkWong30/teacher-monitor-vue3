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