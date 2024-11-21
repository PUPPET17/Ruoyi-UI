<template>
  <el-row>
    <el-col :span="8" class="card-box">
      <el-card>
        <template #header>
          <span>流程图</span>
        </template>
        <VueFlow :nodes="nodes" :edges="edges" style="height: 700px; width: 100%">
        </VueFlow>
      </el-card>
    </el-col>
    <el-col :span="16" class="card-box">
      <el-row>
        <el-col :span="24" class="card-box">
          <el-card>
            <template #header>
              <span>待定内容 1</span>
            </template>
            <!-- 待定内容 1 -->
          </el-card>
        </el-col>
        <el-col :span="24" class="card-box">
          <el-card>
            <template #header>
              <span>待定内容 2</span>
            </template>
            <!-- 待定内容 2 -->
          </el-card>
        </el-col>
        <el-col :span="24" class="card-box">
          <el-card>
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
import { VueFlow } from "@vue-flow/core";

const nodes = ref([
  {
    id: "1",
    type: "input",
    position: { x: 250, y: 5 },
    data: { label: "添加企业(车厂)基本信息" },
  },
  {
    id: "2",
    position: { x: 100, y: 100 },
    data: { label: "联系超级管理员创建系统账号" },
  },
  {
    id: "3",
    position: { x: 250, y: 205 },
    data: { label: "新增企业(车厂)道闸信息" },
  },{
    id: "4",
    position: { x: 400, y: 100 },
    data: { label: "新增企业(车厂)相机信息并认证" },
  }
]);

const edges = ref([
  {
    id: "e1->2",
    source: "1",
    target: "2",
  },
  {
    id: "e2->3",
    source: "2",
    target: "3",
    animated: true,
  },
  {
    id: "e3->4",
    type: "special",
    source: "3",
    target: "4",
    data: {
      hello: "world",
    },
  },
]);
</script>
<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>