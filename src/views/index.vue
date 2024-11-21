<template>
  <el-row>
    <el-col :span="8" class="card-box">
      <el-card class="custom-card">
        <template #header>
          <span>接入流程图</span>
        </template>
        <VueFlow :nodes="nodes" :edges="edges" class="flow-chart">
          <Background pattern-color="#aaa" :gap="14" variant="dots" />
          <!-- <MiniMap /> -->
        </VueFlow>
      </el-card>
    </el-col>
    <el-col :span="16" class="small-card-box">
      <el-row>
        <el-col :span="24" class="small-card-box">
          <el-card class="custom-card">
            <template #header>
              <span>待定内容 1</span>
            </template>
            <!-- 待定内容 1 -->
          </el-card>
        </el-col>
        <el-col :span="24" class="small-card-box">
          <el-card class="custom-card">
            <template #header>
              <span>待定内容 2</span>
            </template>
            <!-- 待定内容 2 -->
          </el-card>
        </el-col>
        <el-col :span="24" class="small-card-box">
          <el-card class="custom-card">
            <template #header>
              <span>待定内容 3</span>
            </template>
            <!-- 待定内容 3 -->
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue";
import { VueFlow, MarkerType } from "@vue-flow/core";
import { Background } from '@vue-flow/background'
// import { MiniMap } from '@vue-flow/minimap'

const nodes = ref([
  {
    id: "1",
    type: "input",
    position: { x: 200, y: 8 },
    data: { label: "添加企业(车厂)基本信息" },
    class: "bold-node",
    draggable: false
  },
  {
    id: "2",
    position: { x: 25, y: 115 },
    data: { label: "创建系统账号" },
    class: "highlight-node",
    draggable: false
  },
  {
    id: "3",
    position: { x: 200, y: 215 },
    data: { label: "新增企业(车厂)道闸信息" },
    class: "bold-node",
    draggable: false
  },
  {
    id: "4",
    position: { x: 25, y: 325 },
    data: { label: "新增企业(车厂)相机信息并认证" },
    class: "bold-node",
    draggable: false
  },
  {
    id: "5",
    type: "output",
    position: { x: 200, y: 435 },
    data: { label: "录入企业(车厂)车辆信息" },
    class: "bold-node",
    draggable: false
  },
]);

const edges = ref([
  {
    id: "e1->2",
    source: "1",
    target: "2",
    type: 'smoothstep',
    style: { stroke: '#3498db', strokeWidth: 2 },
    animated: true,
    markerEnd: MarkerType.Arrow
  },
  {
    id: "e2->3",
    source: "2",
    target: "3",
    type: 'smoothstep',
    style: { stroke: '#3498db', strokeWidth: 2 },
    animated: true,
    markerEnd: MarkerType.Arrow
  },
  {
    id: "e3->4",
    type: "special",
    source: "3",
    target: "4",
    type: 'smoothstep',
    style: { stroke: '#3498db', strokeWidth: 2 },
    animated: true,
    markerEnd: MarkerType.Arrow
  },
  {
    id: "e4->5",
    source: "4",
    target: "5",
    type: 'smoothstep',
    style: { stroke: '#3498db', strokeWidth: 2 },
    animated: true,
    markerEnd: MarkerType.Arrow
  },
]);
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.card-box {
  margin-top: 10px;
}

.small-card-box {
  margin-top: 5px;
}

.custom-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.flow-chart {
  height: 75vh;
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
}

.highlight-node {
  border: 2px solid #ff0000;
  background-color: #ffe6e6;
  font-weight: bold;
  font-size: 18px;
  color: #e62121;
}

.bold-node {
  font-weight: bold;
  font-size: 15px;
  color: #1a1a1a;
}
</style>