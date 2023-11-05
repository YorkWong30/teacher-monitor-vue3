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
