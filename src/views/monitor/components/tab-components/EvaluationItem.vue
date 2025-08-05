<template>
    <template v-if="item.childList && item.childList.length">
        <!-- 分组行 -->
        <tr class="row-group">
            <td :colspan="2" class="cell-group-title">
                {{ item.description || item.category }}
            </td>
        </tr>
        <!-- 递归渲染子项 -->
        <EvaluationItem v-for="child in item.childList" :key="child.evaluationItemId" :item="child" :scores="scores"
            :depth="depth + 1" is="tr" />
    </template>
    <tr v-else class="row-leaf">
        <td class="cell-title">{{ item.description }}</td>
        <td class="cell-score">
            <label class="radio-label">
                <input type="radio" :name="'score-' + item.evaluationItemId"
                    :checked="scores[item.evaluationItemId] === 1" @change="setScore(1)" />
                <span class="icon ok">✔</span>
            </label>
            <label class="radio-label">
                <input type="radio" :name="'score-' + item.evaluationItemId"
                    :checked="scores[item.evaluationItemId] === 0" @change="setScore(0)" />
                <span class="icon err">✘</span>
            </label>
        </td>
    </tr>
</template>

<script setup>
import { teacherPushEvaluation } from '@/api/evaluate.js'
const props = defineProps({
    item: { type: Object, required: true },
    scores: { type: Object, required: true },
    depth: { type: Number, default: 0 }
})

async function setScore(val) {
    props.scores[props.item.evaluationItemId] = val
    const evaluationResult = val === 1 ? '合格' : '不合格'
    await teacherPushEvaluation({
        diseaseId: 1, // 需要根据实际情况获取
        personId: 19249, // 需要根据实际情况获取
        evaluationItem: props.item.description,
        evaluationResult
    })
}
</script>

<style scoped>
.row-group .cell-group-title {
    background: #f0f4fa;
    font-weight: bold;
    color: #234;
    padding: 10px 12px;
    font-size: 1.08em;
}

.row-leaf {
    border-bottom: 1px solid #f0f0f0;

}

.row-leaf td {
    padding: 6px 8px;
    vertical-align: middle;
    text-align: left;
}

.cell-title {
    color: #262626;
}

.cell-score {
    display: flex;
    justify-content: center;
    gap: 16px;
}

.radio-label {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.radio-label input[type="radio"] {
    display: none;
}

.icon {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    transition: all 0.2s;
    background: #d9d9d9;
}

.radio-label:not(:has(input:checked)) .icon {
    opacity: 0.4;
}

.radio-label:has(input:checked) .icon.ok {
    background: #52c41a;
}

.radio-label:has(input:checked) .icon.err {
    background: #ff4d4f;
}
</style>