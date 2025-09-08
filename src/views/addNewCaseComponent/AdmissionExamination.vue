<!-- 接诊与体检 -->
<template>
    <div class="admission-examination">
        <div class="section-title with-dot">生命体征</div>

        <div class="vital-item">
            <div class="vital-label">1、体温（T）：</div>
            <div class="vital-input x-f">
                <van-field v-model.number="formData.vitals.t" type="number" placeholder="请输入" class="vital-field" />
                <span class="unit">℃</span>
            </div>
        </div>

        <div class="vital-item">
            <div class="vital-label">2、脉搏（P）：</div>
            <div class="vital-input x-f">
                <van-field v-model.number="formData.vitals.p" type="number" placeholder="请输入" class="vital-field" />
                <span class="unit">次/分钟</span>
            </div>
        </div>

        <div class="vital-item">
            <div class="vital-label">3、呼吸频率（R）：</div>
            <div class="vital-input x-f">
                <van-field v-model.number="formData.vitals.r" type="number" placeholder="请输入" class="vital-field" />
                <span class="unit">次/分钟</span>
            </div>
        </div>

        <div class="vital-item">
            <div class="vital-label" style="white-space: wrap;">4、血氧饱和度（SpO2）：</div>
            <div class="vital-input x-f">
                <van-field v-model.number="formData.vitals.spo2" type="number" placeholder="请输入" class="vital-field" />
                <span class="unit">%</span>
            </div>
        </div>

        <div class="vital-item">
            <div class="vital-label">5、心率（HR）：</div>
            <div class="vital-input x-f">
                <van-field v-model.number="formData.vitals.hr" type="number" placeholder="请输入" class="vital-field" />
                <span class="unit">次/分钟</span>
            </div>
        </div>

        <div class="vital-item row">
            <div class="vital-label">6、血压：</div>
            <div class="bp-wrap">

                <van-slider v-model="formData.vitals.bp" range :min="50" :max="200" :step="1" :bar-height="10"
                    active-color="#1a89fa">
                    <template #left-button="{ value }">
                        <div class="custom-button">收缩压{{ value }}</div>
                    </template>
                    <template #right-button="{ value }">
                        <div class="custom-button">舒张压{{ value }}</div>
                    </template>
                </van-slider>


            </div>
        </div>

        <div class="vital-item" v-show="0">
            <div class="vital-label">7、呼气末二氧化碳（ETCO2）：</div>
            <div class="vital-input x-f">
                <van-field v-model.number="formData.vitals.ecot2" type="number" placeholder="请输入" class="vital-field" />
                <span class="unit">mmHg</span>
            </div>
        </div>

        <!-- <div class="vital-item column">
            <div class="vital-label">8、其他生命体征</div>
            <van-field v-model="formData.vitals.other" type="textarea" :autosize="{ minHeight: 90, maxHeight: 180 }"
                placeholder="例如：皮肤黏膜的颜色、温度、湿度、有无水肿、皮疹；头颈部颈静脉有无怒张、气管是否居中、甲状腺大小" class="card-textarea" />
        </div> -->

        <div class="section-title with-dot">学员任务</div>
        <div class="task-group">
            <div class="task-head x-bc">
                <div class="task-title"></div>
                <div class="add-task" @click="addTask">新增任务 <span>＋</span></div>
            </div>

            <div class="task-list">
                <div class="task-card" v-for="(task, index) in formData.tasks" :key="index">
                    <template v-if="task.status !== 'done'">
                        <div class="task-form">
                            <div class="task-row">
                                <div class="task-label">任务名称：</div>
                                <van-field v-model="task.name" placeholder="请输入任务名称" class="task-field" />
                            </div>

                            <div class="task-row row">
                                <div class="task-label" style="margin-bottom: 5px;">任务描述：</div>
                                <van-field v-model="task.description" type="textarea"
                                    :autosize="{ minHeight: 60, maxHeight: 200 }" placeholder="请输入任务描述："
                                    class="card-textarea" />
                            </div>

                            <div class="task-row row">
                                <div class="task-label" style="margin-bottom: 5px;">任务结果：</div>
                                <van-field v-model="task.result" type="textarea"
                                    :autosize="{ minHeight: 60, maxHeight: 200 }" placeholder="请输入任务结果"
                                    class="card-textarea" />
                            </div>

                            <div class="task-actions x-f">
                                <van-button size="mini" class="btn-cancel" @click="removeTask(index)">删除</van-button>
                                <van-button size="mini" type="primary" class="btn-ok"
                                    @click="confirmTask(index)">保存</van-button>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="task-read">
                            <div class="task-read-row"><span class="task-read-label">任务名称：</span><span
                                    class="task-read-text">{{
                                        task.name || '-' }}</span></div>
                            <div class="task-read-row row">
                                <span class="task-read-label">任务结果：</span>
                                <div class="task-read-content">{{ task.result || '-' }}</div>
                            </div>
                            <div class="task-actions x-f">
                                <van-button size="mini" class="btn-cancel" @click="editTask(index)">编辑</van-button>
                                <van-button size="mini" class="btn-cancel" @click="removeTask(index)">删除</van-button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            vitals: { t: "", p: "", r: "", spo2: "", other: "" },
            tasks: [],
        })
    }
});

const emit = defineEmits(['update:modelValue']);

const formData = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

// 学员任务交互
const addTask = () => {
    const newFormData = { ...formData.value };
    newFormData.tasks.push({ name: "", result: "", status: "editing" });
    formData.value = newFormData;
};

const removeTask = (index) => {
    const newFormData = { ...formData.value };
    newFormData.tasks.splice(index, 1);
    formData.value = newFormData;
};

const confirmTask = (index) => {
    const newFormData = { ...formData.value };
    newFormData.tasks[index].status = "done";
    formData.value = newFormData;
};

const editTask = (index) => {
    const newFormData = { ...formData.value };
    newFormData.tasks[index].status = "editing";
    formData.value = newFormData;
};
</script>

<style lang="scss" scoped>
.section-title {
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    box-sizing: border-box;
}

.with-dot {
    position: relative;
    padding-left: 20px;
}

.with-dot::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 14px;
    background: #007FE7;
    border-radius: 2px;
}

.vital-item {
    display: flex;
    align-items: center;
    padding: 6px 20px;
    box-sizing: border-box;

    &.column {
        flex-direction: column;
        align-items: stretch;
    }
}

.vital-label {
    flex: 0 0 auto;
    width: 130px;
    margin-left: 8px;
    color: #000000;
    text-align: left;
    // white-space: nowrap;
}

.vital-input {
    flex: 1;
    display: flex;
    align-items: center;
}

.vital-field {
    :deep(.van-field__body) {
        height: 20px;
    }
}

.unit {
    color: #666666;
    white-space: nowrap;
    width: 100px;
    text-align: left;
}

.task-group {
    padding: 6px 20px 14px 20px;
    box-sizing: border-box;
}

.task-head {
    padding: 0 6px 6px 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.task-title {
    font-size: 14px;
    color: #333333;
}

.add-task {
    color: #007FE7;
}

.task-card {
    background: #EBF1FF;
    border-radius: 8px;
    border: 1px solid #e6e8eb;
    padding: 10px 10px 10px 10px;

    &+.task-card {
        margin-top: 10px;
    }
}

.task-row {
    display: flex;
    padding: 4px 0;
    gap: 9px;

    &.row {
        flex-direction: row;
        align-items: stretch;
    }

    :deep(.van-cell) {
        padding: 0;
        border-radius: 6px;
    }

    :deep(.van-field__body) {
        background-color: #fff !important;
    }
}

.task-label {
    width: 64px;
    color: #000;
    text-align: left;
    white-space: nowrap;
    padding-top: 6px;
    box-sizing: border-box;
}

.task-field {
    :deep(.van-field__body) {
        height: 30px;
        border-radius: 10px;
    }
}

.task-actions {
    justify-content: flex-end;
    gap: 8px;
    padding-top: 8px;
    display: flex;
    align-items: center;
}

.btn-cancel {
    background: #fff;
    color: #666;
    border: 1px solid #d7dbe0;
}

.btn-ok {
    min-width: 74px;
}

.task-read-row {
    display: flex;
    align-items: flex-start;
    padding: 4px 0;
    white-space: nowrap;

    &.row {
        flex-direction: row;
    }
}

.task-read-label {
    width: 64px;
    color: #666;
}

.task-read-text {
    color: #111;
}

.task-read-content {
    text-align: left;
    white-space: pre-wrap;
}

.card-textarea {
    :deep(.van-field__body) {
        background: #f7f8fa;
        border-radius: 8px;
        padding: 10px 12px;
        max-height: 220px;
        overflow-y: auto;
    }

    :deep(.van-field__control) {
        font-size: 14px;
        line-height: 20px;
        white-space: pre-wrap;
        word-break: break-word;
    }

    :deep(.van-field__control::placeholder) {
        font-size: 12px;
        line-height: 18px;
        color: #9aa0a6;
    }
}

.bp-wrap {
    flex: 1;
    padding: 20px 20px;
    box-sizing: border-box;
}

.custom-button {
    min-width: 26px;
    padding: 2px 4px;
    box-sizing: border-box;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: #1a89fa;
    border-radius: 100px;
    border: 2px solid #fff;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
}
</style>
