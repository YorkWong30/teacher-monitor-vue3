import request from "@/utils/request";

// 查询评分表
export function queryEvaluation(data) {
    return request({
        url: "/jhcloud-train/emergencyMedicine/evaluation/queryEvaluation",
        headers: {
            isToken: true,
            "content-type": "application/json",
        },
        method: "post",
        data: data,
    });
}


export function teacherPushEvaluation(data) {
    return request({
        url: "/jhcloud-train/emergencyMedicine/teacherPushEvaluation",
        headers: {
            isToken: true,
            "content-type": "application/json",
        },
        method: "post",
        data: data,
    });
}

export function aiGlassesHint(data) {
    return request({
        url: "/jhcloud-train/AiChat/aiGlassesHint",
        headers: {
            isToken: true,
            "content-type": "application/json",
        },
        method: "post",
        data: data,
    });
}
