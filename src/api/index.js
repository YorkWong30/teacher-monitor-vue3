import request from "@/utils/request";

//v1老师端，初始化
export function init(data) {
  return request({
    url: "/jhcloud-train/emergencyMedicine/v1/teacherSide/init",
    headers: {
      isToken: true,
      "content-type": "application/json",
    },
    method: "post",
    data: data,
  });
}
