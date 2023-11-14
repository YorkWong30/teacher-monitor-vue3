import request from "@/utils/request";

//v1老师端，初始化
export function init(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/v2/teacherSide/init",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}

//老师端给学员推送流程
export function teacherPushWorkflow(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/teacherPushWorkflow",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}

export function teacherPushReport(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/teacherPushReport",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}

export function teacherPushLifeState(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/teacherPushLifeState",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}

export function teacherPushMonitor(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/teacherPushMonitor",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}

export function reset(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/reset",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}
