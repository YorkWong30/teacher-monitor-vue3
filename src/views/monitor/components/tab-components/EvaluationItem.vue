<template>
    <template v-if="item.childList && item.childList.length">
        <!-- 分组行 -->
        <tr class="row-group">
            <td :colspan="2" class="cell-group-title">
                <span style="font-size: 24px;font-weight: bolder;">
                    {{ item.category }}
                </span>
                <button class="horn-btn horn-btn--f" title="F=提醒学员自己思考"
                    @click="$emit('hint', { secret: 'F', scope: 'group', item })">提醒医生自己思考</button>
                <button class="horn-btn horn-btn--a" title="A=回报正确答案"
                    @click="$emit('hint', { secret: 'A', scope: 'group', item })">向学员解答</button>
            </td>
        </tr>
        <!-- 递归渲染子项 -->
        <EvaluationItem v-for="child in item.childList" :key="child.evaluationItemId" :item="child" :scores="scores"
            :evaluationItemId="evaluationItemId" :diseaseId="diseaseId" :depth="depth + 1" is="tr"
            :evaluationId="evaluationId" :personId="personId" @hint="$emit('hint', $event)" />
    </template>
    <tr v-else class="row-leaf">
        <td class="cell-title">
            <div class="item-content">
                <div class="item-main">
                    <span class="item-description">{{ item.category || item.description }}</span>
                    <div class="item-actions">
                        <button v-if="scores[item.evaluationItemId] !== 1" class="horn-btn horn-btn--s sm"
                            title="S=提醒具体项目" @click="$emit('hint', { secret: 'S', scope: 'item', item })">提示该项</button>
                    </div>
                </div>
                <div class="item-result" v-if="item.result">
                    <div class="item-result-content">
                        <span class="result-label"></span>
                        <span class="result-value">{{ item.result }}</span>
                    </div>
                    <div class="item-result-actions">
                        <button class="horn-btn horn-btn--r sm" title="R=回报结果"
                            @click="$emit('hint', { secret: 'R', scope: 'item', item })">回报结果</button>
                    </div>
                </div>
            </div>
        </td>
        <td class="cell-score">
            <div class="x-c" style="gap: 20px;min-height: 100px;padding: 0 8px;box-sizing: border-box;">
                <button type="button"
                    class="score-btn ok"
                    :class="{ active: scores[item.evaluationItemId] === 1 }"
                    @click="setScore(1, item.evaluationItemId)">✔</button>
                <button type="button"
                    class="score-btn err"
                    :class="{ active: scores[item.evaluationItemId] === 0 }"
                    @click="setScore(0, item.evaluationItemId)">✘</button>
            </div>
        </td>
    </tr>
</template>

<script setup>
import { teacherPushEvaluation } from '@/api/evaluate.js'
import { ref } from 'vue'


const props = defineProps({
    item: { type: Object, required: true },
    scores: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    evaluationItemId: { type: [Number, String], required: true },
    diseaseId: { type: [Number, String], required: true },
    personId: { type: [Number, String], required: true },
    evaluationId: { type: [Number, String], required: true },
})

const emit = defineEmits(['hint'])



async function setScore(val, son_evaluationItemId) {

    let evaluationResultId = localStorage.getItem('current_evaluationResultId')
    console.log('current_evaluationResultId..', evaluationResultId);

    // 检查是否重复点击同一个选项
    console.log('props.scores[props.item.evaluationItemId]', props.scores[props.item.evaluationItemId]);
    console.log(val, 'val');


    if (props.scores[props.item.evaluationItemId] === val) {
        // 重复点击，取消选择
        props.scores[props.item.evaluationItemId] = '';
        return;
    }

    props.scores[props.item.evaluationItemId] = val
    const evaluationResult = val === 1 ? 'true' : 'false'
    await teacherPushEvaluation({
        diseaseId: props?.diseaseId, // 需要根据实际情况获取
        personId: props.personId, // 需要根据实际情况获取
        evaluationItem: props.item.description,
        evaluationItemId: son_evaluationItemId,
        diseaseId: props.diseaseId,
        evaluationResult,
        evaluationId: props.evaluationId,
        evaluationResultId
    }).then(data => {
        console.log('data', data);
        localStorage.setItem('current_evaluationResultId', data?.data?.evaluationResultId)

    })
}
</script>

<style scoped>
.row-group .cell-group-title {
    background-color: #3b82f6;
    font-weight: 700;
    color: #fff;
    padding: 14px 16px;
    font-size: 1.1em;
    /* border-left: 4px solid #3b82f6; */
    position: relative;
    text-align: left;
}

.row-leaf {
    border-bottom: 1px solid #f0f0f0;

}

.row-leaf td {
    padding: 0;
    vertical-align: middle;
    text-align: left;

}

.cell-title {
    color: #1f2937;
    font-weight: 500;
    font-size: 0.95em;
    line-height: 1.5;
}

.item-content {
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    gap: 4px;
}

.item-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.item-description {
    flex: 1;
    font-weight: bold;
    color: #374151;
    font-size: 15px;
}

.item-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.item-result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: #fff;
    border-radius: 8px;
    font-size: 13px;
}

.item-result-content {
    align-items: center;
    gap: 8px;
}


.result-label {
    font-size: 10px;
    white-space: nowrap;
    color: #6b7280;
    font-weight: 500;
}

.result-value {
    font-size: 0.9em;
    color: #3c82f6;
    font-weight: 600;
}

.cell-score {
    display: flex;
    justify-content: center;
    gap: 16px;

}

.score-btn {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    background: #d9d9d9;
    transition: all 0.15s ease;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    filter: grayscale(1);
    opacity: 0.2;
}

.score-btn.ok { background: #5bbb6a; }
.score-btn.err { background: #ff6b6f; }

.score-btn.active {
    box-shadow: 0 0 0 2px rgba(0,0,0,0.06) inset;
    filter: grayscale(0);
    opacity: 1;

}

.score-btn:active {
    transform: scale(0.96);
}

.horn-btn {
    margin-left: 12px;
    padding: 6px 12px;
    font-size: 11px;
    border: 1px solid transparent;
    background: #fff;
    border-radius: 20px;
    cursor: pointer;
    line-height: 1.2;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    min-width: fit-content;
}

.horn-btn.sm {
    margin-left: 0;
    padding: 6px 10px;
    font-size: 10px;
    border-radius: 16px;
}

.horn-btn--f {
    color: #3c82f6;
    background: #FFF;
    border-color: #3c82f6;
}

.horn-btn--a {

    color: #3c82f6;
    background: #FFF;
    border-color: #3c82f6;

}

.horn-btn--s {
    color: #000;
    background: #fff;
    border-color: #000;
}

.horn-btn--r {
    color: #3c82f6;
    background: #fff;
    border-color: #3c82f6;
}

.horn-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.horn-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>