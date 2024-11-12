<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="auto"
      label-position="left">
      <el-row>
        <el-col :span="4">
          <el-form-item label="企业名称" prop="companyName">
            <el-tooltip class="item" effect="light" content="支持模糊搜索" placement="bottom" popper-class="fade">
              <el-input v-model="queryParams.companyName" placeholder="请输入企业名称" clearable @keyup.enter="handleQuery" />
            </el-tooltip>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="企业评级" prop="level">
            <el-input v-model="queryParams.level" placeholder="请输入企业评级" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="禁行排放等级" prop="emissionState">
            <el-select v-model="queryParams.emissionState" placeholder="请选择禁行排放等级" style="width: 180px;" clearable>
              <el-option v-for="dict in emission_state" :key="dict.value" :label="dict.label" :value="dict.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" />
        <!-- <el-col :span="8">
          <el-form-item label="创建时间" prop="createDate">
            <el-date-picker clearable v-model="queryParams.createDate" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择创建时间" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="服务失效时间" prop="expireTime">
            <el-date-picker clearable v-model="queryParams.expireTime" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择服务失效时间" />
          </el-form-item>
        </el-col>
        <el-col :span="8" /> -->
        <el-col :span="4">
          <el-form-item label="联网状态" prop="isOnline" style="width: 100%; margin-bottom: 20px;">
            <div class="custom-style">
              <el-segmented v-model="queryParams.isOnline"
                :options="is_online.map(dict => ({ label: dict.label, value: dict.value }))" />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:info:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:info:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:info:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['system:info:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <transition name="dialog-fade">
      <div v-if="qrcodeDialogVisible" class="custom-dialog-overlay" @click.self="closeQRCodeDialog">
        <div class="custom-dialog">
          <div class="dialog-header">
            <span>车辆信息录入二维码</span>
            <i class="el-icon-close" @click="closeQRCodeDialog"></i>
          </div>
          <div class="dialog-body">
            <div class="qrcode-wrapper">
              <img :src="qrcode" alt="QR Code" class="qrcode-image" />
              <div class="download-button" @click="downloadQRCode">
                <i class="el-icon-download"></i>
                <span>下载二维码</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业名称" align="center" prop="companyName" />
      <el-table-column label="二维码" align="center" width="100">
        <template #default="scope">
          <div @click="getQRCode(scope.row)" class="custom-btn">
            二维码
          </div>
        </template>
      </el-table-column>
      <el-table-column label="行政区划" align="center" prop="region" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="130">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="企业编码" align="center" prop="identifier" /> -->
      <el-table-column label="联网状态" align="center" prop="isOnline">
        <template #default="scope">
          <dict-tag :options="is_online" :value="scope.row.isOnline" />
        </template>
      </el-table-column>
      <el-table-column label="企业地址" align="center" prop="address" show-overflow-tooltip />
      <el-table-column label="企业评级" align="center" prop="level" />
      <el-table-column label="法人代表" align="center" prop="legalRpst" />
      <el-table-column label="ocr收费标准" align="center" prop="ocrFeeStandard" />
      <el-table-column label="服务费" align="center" prop="serviceFee" />
      <el-table-column label="服务失效时间" align="center" prop="expireTime" width="110">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expireTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自动开闸" align="center" prop="isAutoOpen">
        <template #default="scope">
          <dict-tag :options="is_auto_open" :value="scope.row.isAutoOpen" />
        </template>
      </el-table-column>
      <el-table-column label="录入车辆" align="center" prop="isRegis">
        <template #default="scope">
          <dict-tag :options="is_regis" :value="scope.row.isRegis" />
        </template>
      </el-table-column>
      <el-table-column label="企业分类" align="center" prop="classifi" />
      <el-table-column label="禁行排放等级" align="center" prop="emissionState">
        <template #default="scope">
          <dict-tag :options="emission_state" :value="scope.row.emissionState" />
        </template>
      </el-table-column>
      <el-table-column label="接口平台" align="center" prop="apiStrategy">
        <template #default="scope">
          <dict-tag :options="api_strategy" :value="scope.row.apiStrategy" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:info:edit']">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:info:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改企业信息对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="infoRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="行政区划" prop="region">
          <el-input v-model="form.region" placeholder="请输入行政区划" />
        </el-form-item>
        <!-- <el-form-item label="企业id" prop="companyId">
          <el-input v-model="form.companyId" placeholder="请输入企业id" />
        </el-form-item> -->
        <el-form-item label="创建时间" prop="createDate">
          <el-date-picker clearable v-model="form.createDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="企业编码" prop="identifier">
          <el-input v-model="form.identifier" placeholder="请输入企业编码" />
        </el-form-item>
        <el-form-item label="联网状态" prop="isOnline">
          <el-radio-group v-model="form.isOnline">
            <el-radio v-for="dict in is_online" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label
              }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="企业地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入企业地址" />
        </el-form-item>
        <el-form-item label="企业评级" prop="level">
          <el-input v-model="form.level" placeholder="请输入企业评级" />
        </el-form-item>
        <el-form-item label="法人代表" prop="legalRpst">
          <el-input v-model="form.legalRpst" placeholder="请输入法人代表" />
        </el-form-item>
        <el-form-item label="ocr收费标准" prop="ocrFeeStandard">
          <el-input v-model="form.ocrFeeStandard" placeholder="请输入ocr收费标准" />
        </el-form-item>
        <el-form-item label="服务费" prop="serviceFee">
          <el-input v-model="form.serviceFee" placeholder="请输入服务费" />
        </el-form-item>
        <el-form-item label="服务失效时间" prop="expireTime">
          <el-date-picker clearable v-model="form.expireTime" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择服务失效时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="自动开闸" prop="isAutoOpen">
          <el-radio-group v-model="form.isAutoOpen">
            <el-radio v-for="dict in is_auto_open" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label
              }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="录入车辆" prop="isRegis">
          <el-radio-group v-model="form.isRegis">
            <el-radio v-for="dict in is_regis" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label
              }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="企业分类" prop="classifi">
          <el-input v-model="form.classifi" placeholder="请输入企业分类" />
        </el-form-item>
        <el-form-item label="禁行排放等级" prop="emissionState">
          <el-select v-model="form.emissionState" placeholder="请选择禁行排放等级">
            <el-option v-for="dict in emission_state" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口平台" prop="apiStrategy">
          <el-radio-group v-model="form.apiStrategy">
            <el-radio v-for="dict in api_strategy" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label
              }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地磅系统密码" prop="weightPassword">
          <el-input v-model="form.weightPassword" placeholder="请输入地磅系统密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info">
import { listInfo, getInfo, delInfo, addInfo, updateInfo, getStaticQrCode } from "@/api/system/info";

const { proxy } = getCurrentInstance();
const { api_strategy, is_online, is_regis, is_auto_open, emission_state } = proxy.useDict('api_strategy', 'is_online', 'is_regis', 'is_auto_open', 'emission_state');

const infoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  qrcode: null,
  qrcodeDialogVisible: false,
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    companyName: null,
    region: null,
    companyId: null,
    createDate: null,
    identifier: null,
    isOnline: null,
    address: null,
    level: null,
    legalRpst: null,
    ocrFeeStandard: null,
    serviceFee: null,
    expireTime: null,
    isAutoOpen: null,
    isRegis: null,
    classifi: null,
    emissionState: null,
    apiStrategy: null,
    userId: null,
    deptId: null,
    weightPassword: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const { qrcode, qrcodeDialogVisible } = toRefs(data);

/** 查询企业信息列表 */
function getList() {
  loading.value = true;
  console.log(queryParams.value)
  listInfo(queryParams.value).then(response => {
    infoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    companyName: null,
    region: null,
    companyId: null,
    createDate: null,
    identifier: null,
    isOnline: null,
    address: null,
    level: null,
    legalRpst: null,
    ocrFeeStandard: null,
    serviceFee: null,
    expireTime: null,
    isAutoOpen: null,
    isRegis: null,
    classifi: null,
    emissionState: null,
    apiStrategy: null,
    userId: null,
    deptId: null,
    weightPassword: null
  };
  proxy.resetForm("infoRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加企业信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getInfo(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改企业信息";
  });
}

// 获取二维码
function getQRCode(row) {
  if (!row || !row.companyId) {
    console.error("Invalid row or missing companyId");
    return;
  }
  const companyId = row.companyId;
  getStaticQrCode(companyId).then(response => {
    console.log("Response:", response);
    if (!response) {
      console.error("No QR code data returned");
      return;
    }

    const qrCodeData = response;
    console.log("QR code data:", qrCodeData);
    const blob = new Blob([qrCodeData], { type: 'image/png' });
    const imageUrl = URL.createObjectURL(blob);
    data.qrcode = imageUrl;
    data.qrcodeDialogVisible = true;
  }).catch(error => {
    console.error("Failed to fetch QR code:", error);
  });
}

// 关闭qrcode弹窗
function closeQRCodeDialog() {
  data.qrcodeDialogVisible = false;
}

function submitForm() {
  proxy.$refs["infoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除企业信息编号为"' + _ids + '"的数据项？').then(function () {
    return delInfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}

function downloadQRCode() {
  const link = document.createElement('a');
  link.href = qrcode.value;
  link.download = '车辆信息录入二维码.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

getList();
</script>
<style scoped>
.custom-style .el-segmented {
  --el-segmented-item-selected-color: #F2F6FC;
  --el-segmented-item-selected-bg-color: #409EFF;
  --el-border-radius-base: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: transform 0.3s var(--el-transition-function-fast-bezier);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.custom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  font-size: 14px;
  background-color: #f0f7ff;
  color: #409EFF;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #d9ecff;
  min-width: 80px;
}

.custom-btn:hover {
  background-color: #409EFF;
  color: white;
  transform: translateY(-1px);
}

/* 确保按钮大小和文字都能完整显 */
.custom-btn:active {
  background-color: #3398ff;
  /* 按下时按钮变色 */
}

.custom-btn:focus {
  outline: none;
  /* 去掉聚焦时的蓝色边框 */
}

.qrcode-dialog :deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.qrcode-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.qrcode-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.qrcode-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 4px;
}

.qrcode-container img {
  width: 310px;
  height: 310px;
  object-fit: contain;
  border: 1px solid #ebeef5;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.qrcode-dialog :deep(.el-overlay) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrcode-dialog :deep(.el-dialog) {
  margin-top: 0 !important;
  border-radius: 8px;
  overflow: hidden;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.qrcode-container img {
  width: 310px;
  height: 310px;
  object-fit: contain;
  border: 1px solid #ebeef5;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
}

.custom-dialog {
  background: white;
  border-radius: 8px;
  width: 360px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  transform-origin: center;
}

.dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
}

.dialog-header span {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  opacity: 0;
  animation: fadeInUp 0.4s ease forwards;
  animation-delay: 0.2s;
}

.dialog-header i {
  cursor: pointer;
  font-size: 18px;
  color: #909399;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.4s ease forwards;
  animation-delay: 0.3s;
}

.dialog-header i:hover {
  color: #333;
  transform: rotate(90deg);
}

.dialog-body {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrcode-image {
  width: 310;
  height: 310px;
  object-fit: contain;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  opacity: 0;
  animation: qrcodeFadeIn 0.6s ease forwards;
  animation-delay: 0.3s;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fff;
}

.qrcode-image:hover {
  transform: scale(1.05);
  border-color: #409EFF;
  background-color: #f0f7ff;
  cursor: pointer;
}

@keyframes qrcodeFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(3px);
  }
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-dialog-overlay.closing {
  animation: overlayFadeOut 0.3s ease forwards;
}

.custom-dialog-overlay.closing .custom-dialog {
  animation: dialogSlideOut 0.3s ease forwards;
}

@keyframes overlayFadeOut {
  from {
    opacity: 1;
    backdrop-filter: blur(3px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0);
  }
}

@keyframes dialogSlideOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.dialog-fade-enter-active {
  animation: overlayFadeIn 0.3s ease;
}

.dialog-fade-enter-active .custom-dialog {
  animation: dialogSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-fade-leave-active {
  animation: overlayFadeOut 0.3s ease forwards;
}

.dialog-fade-leave-active .custom-dialog {
  animation: dialogSlideOut 0.3s ease forwards;
}

@keyframes overlayFadeOut {
  from {
    opacity: 1;
    backdrop-filter: blur(3px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0);
  }
}

@keyframes dialogSlideOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
}

.qrcode-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 4px;
  background-color: #f0f7ff;
  color: #409EFF;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #d9ecff;
  opacity: 0;
  animation: fadeInUp 0.4s ease forwards;
  animation-delay: 0.6s;
}

.download-button:hover {
  background-color: #409EFF;
  color: white;
  transform: translateY(-2px);
}

.download-button:active {
  transform: translateY(0);
}

.download-button i {
  font-size: 16px;
}

.qrcode-image {
  margin-bottom: 0; 
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>