<template>
  <div class="camera-config">
    <!-- 左侧树形结构 -->
    <div class="tree-container">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        lazy
        :load="loadNode"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-icon v-if="data.type === 'camera'"><VideoCamera /></el-icon>
            <el-icon v-else-if="data.type === 'screen'"><Monitor /></el-icon>
            <el-icon v-else-if="data.type === 'gate'"><SetUp /></el-icon>
            <el-icon v-else></el-icon>
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </div>

    <!-- 右侧配置表单 -->
    <div class="config-form">
      <!-- 当选中屏幕时显示屏幕配置表单 -->
      <el-form v-if="selectedType === 'screen'" :model="formData" label-width="120px">
        <!-- 基础信息 -->
        <div class="section-title">基础信息</div>
        <el-form-item label="屏幕序列号">
          <el-input v-model="formData.led_sn" class="w-300" />
        </el-form-item>
        
        <el-form-item label="屏幕型号">
          <el-select v-model="formData.model" class="w-300">
            <el-option label="G型" value="G" />
            <el-option label="M型" value="M" />
          </el-select>
        </el-form-item>

        <el-form-item label="屏幕类型">
          <el-select v-model="formData.led_type" class="w-300">
            <el-option label="主屏" :value="1" />
            <el-option label="入口道闸" :value="2" />
            <el-option label="出口道闸" :value="3" />
          </el-select>
        </el-form-item>

        <!-- 显示内容配置 -->
        <div class="section-title">显示内容配置</div>
        <div class="display-content">
          <el-form-item 
            v-for="(item, index) in 4" 
            :key="index"
            :label="`第${item}行显示`"
          >
            <el-select v-model="formData.content[index].color" class="w-200">
              <el-option label="红色" value="red" />
              <el-option label="黄色" value="yellow" />
            </el-select>
            <el-radio-group v-model="formData.content[index].type">
              <el-radio :value="'custom'">自定义</el-radio>
              <el-radio :value="'plate'">车牌号</el-radio>
              <el-radio :value="'time'">时间</el-radio>
            </el-radio-group>
            <el-input 
              v-if="formData.content[index].type === 'custom'"
              v-model="formData.content[index].text"
              class="w-300 mt-10"
              placeholder="请输入显示内容"
            />
          </el-form-item>
        </div>

        <!-- 保存按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>

      <!-- 当选中相机时显示相机配置表单 -->
      <el-form v-if="selectedType === 'camera'" :model="cameraForm" label-width="120px">
        <div class="section-title">相机配置</div>
        <el-form-item label="相机IP">
          <el-input v-model="cameraForm.ip" class="w-300" />
        </el-form-item>
        <!-- 其他相机配置项... -->
      </el-form>

      <!-- 当选中道闸时显示道闸配置表单 -->
      <el-form v-if="selectedType === 'gate'" :model="gateForm" label-width="120px">
        <div class="section-title">道闸配置</div>
        <el-form-item label="道闸名称">
          <el-input v-model="gateForm.turnName" class="w-300" />
        </el-form-item>
        <el-form-item label="道闸类型">
          <el-select v-model="gateForm.type" class="w-300">
            <el-option label="入口" value="entrance" />
            <el-option label="出口" value="exit" />
          </el-select>
        </el-form-item>
        
        <!-- 设备列表 -->
        <div class="section-title">设备列表</div>
        <el-table :data="deviceList" border style="width: 100%">
          <el-table-column prop="type" label="设备类型" width="120">
            <template #default="{ row }">
              <el-tag :type="row.type === 'camera' ? 'success' : 'warning'">
                {{ row.type === 'camera' ? '相机' : 'LED屏' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'online' ? 'success' : 'danger'">
                {{ row.status === 'online' ? '在线' : '离线' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleConfigDevice(row)">配置</el-button>
              <el-button type="danger" link @click="handleDeleteDevice(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加设备按钮 -->
        <div class="mt-20">
          <el-button type="primary" @click="handleAddDevice">添加设备</el-button>
        </div>

        <!-- 保存按钮 -->
        <el-form-item class="mt-20">
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { VideoCamera, Monitor, SetUp } from '@element-plus/icons-vue'
import { selectIds } from "@/api/system/info";
import { getGateList, getDeviceList, getGateInfo } from '@/api/system/device'
import { ElMessage } from 'element-plus';

// 树形数据结构
const treeData = ref([])

const defaultProps = {
  children: 'children',
  label: 'label',
  isLeaf: 'isLeaf'
}

// 当前选中的设备类型
const selectedType = ref('')

// 屏幕配置表单数据
const formData = reactive({
  led_sn: '',
  model: 'G',
  led_type: 1,
  camera_id: null,
  content: [
    { color: 'red', type: 'custom', text: '欢迎光临' },
    { color: 'yellow', type: 'plate', text: '' },
    { color: 'red', type: 'custom', text: '一车一杆' },
    { color: 'yellow', type: 'time', text: '' }
  ]
})

// 相机配置表单数据
const cameraForm = reactive({
  ip: '',
  port: '',
  username: '',
  password: ''
})

// 道闸配置表单数据
const gateForm = reactive({
  turnName: '',
  type: 'entrance',
  id: null
})

// 设备列表数据
const deviceList = ref([])

// 处理树节点点击
const handleNodeClick = (data) => {
  selectedType.value = data.type
  
  if (data.type === 'screen') {
    // 加载屏幕配置
    loadScreenConfig(data.id)
  } else if (data.type === 'camera') {
    // 加载相机配置
    loadCameraConfig(data.id)
  } else if (data.type === 'gate') {
    // 加载道闸配置
    loadGateConfig(data.id)
  }
}

// 加载屏幕配置
const loadScreenConfig = (screenId) => {
  // TODO: 调用API加载屏幕配置
  console.log('加载屏幕配置:', screenId)
}

// 加载相机配置
const loadCameraConfig = (cameraId) => {
  // TODO: 调用API加载相机配置
  console.log('加载相机配置:', cameraId)
}

// 加载道闸配置
const loadGateConfig = async (gateId) => {
  try {
    console.log("道闸id", gateId)
    // 加载道闸基本信息
    const gateInfo = await getGateInfo(gateId) 
    console.log("道闸信息", gateInfo)
    gateForm.id = gateInfo.data.id
    gateForm.turnName = gateInfo.data.turnName
    gateForm.type = gateInfo.data.type
    
    // 加载道闸下的设备列表
    const devices = await getDeviceList(gateId)
    deviceList.value = devices
  } catch (error) {
    console.error('加载道闸配置失败:', error)
    ElMessage.error('加载道闸配置失败')
  }
}

// 处理添加设备
const handleAddDevice = () => {
  // 打开添加设备的对话框
  // TODO: 实现添加设备的逻辑
}

// 处理配置设备
const handleConfigDevice = (device) => {
  // 根据设备类型切换到相应的配置表单
  selectedType.value = device.type
  if (device.type === 'camera') {
    loadCameraConfig(device.id)
  } else if (device.type === 'screen') {
    loadScreenConfig(device.id)
  }
}

// 处理删除设备
const handleDeleteDevice = async (device) => {
  try {
    await ElMessageBox.confirm('确认删除该设备吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用删除设备API
    ElMessage.success('删除成功')
    // 重新加载设备列表
    await loadGateConfig(gateForm.id)
  } catch (error) {
    console.error('删除设备失败:', error)
  }
}

// 保存配置
const handleSave = async () => {
  if (selectedType.value === 'screen') {
    const saveData = {
      led_sn: formData.led_sn,
      model: formData.model,
      led_type: formData.led_type,
      camera_id: formData.camera_id,
      content: JSON.stringify(formData.content)
    }
    console.log('保存屏幕配置:', saveData)
  } else if (selectedType.value === 'camera') {
    console.log('保存相机配置:', cameraForm)
  } else if (selectedType.value === 'gate') {
    try {
      // TODO: 调用保存道闸配置的API
      await saveGateConfig({
        id: gateForm.id,
        name: gateForm.name,
        type: gateForm.type
      })
      ElMessage.success('保存成功')
    } catch (error) {
      console.error('保存道闸配置失败:', error)
      ElMessage.error('保存失败')
    }
  }
}

// 初始化加载企业列表
async function initEnterpriseList() {
  try {
    const response = await selectIds()
    treeData.value = response.rows.map(item => ({
      id: item.companyId,
      label: item.companyName,
      type: 'company',
      isLeaf: false
    }))
    console.log("企业列表", treeData.value)
  } catch (error) {
    console.error("获取企业列表失败", error)
  }
}

// 懒加载节点数据
const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    return resolve(treeData.value)
  }

  const { data } = node
  try {
    if (data.type === 'company') {
      console.log("企业id", data.id)
      // 加载企业下的道闸列表
      const response = await getGateList(data.id)
      // 确保 gates 是一个数组
      const gates = response.rows || response.data || []
      console.log("道闸列表", gates)
      const gateNodes = gates.map(gate => ({
        id: gate.id,
        label: gate.name,
        type: 'gate',
        isLeaf: false,
        parentId: data.id
      }))
      resolve(gateNodes)
    } 
    else if (data.type === 'gate') {
      // 加载道闸下的设备（屏幕和相机）
      const devices = await getDeviceList(data.id)
      const deviceNodes = [
        {
          id: `screen_${devices.screenId}`,
          label: `LED屏-[${devices.screenModel}]${devices.screenIp}`,
          type: 'screen',
          isLeaf: true
        },
        {
          id: `camera_${devices.cameraId}`,
          label: `相机-[车牌识别]${devices.cameraIp}`,
          type: 'camera',
          isLeaf: true
        }
      ]
      resolve(deviceNodes)
    } 
    else {
      resolve([])
    }
  } catch (error) {
    console.error('加载节点数据失败:', error)
    resolve([])
  }
}

// 初始化加载企业列表
initEnterpriseList()
</script>

<style scoped>
.camera-config {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.tree-container {
  width: 300px;
  border-right: 1px solid #dcdfe6;
}

.config-form {
  flex: 1;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-tree-node .el-icon {
  font-size: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #606266;
}

.w-200 {
  width: 200px;
}

.w-300 {
  width: 300px;
}

.display-content {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}
</style>
