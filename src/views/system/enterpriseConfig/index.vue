<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="是否自动开闸" prop="isAutoOpen">
            <el-select v-model="queryParams.isAutoOpen" placeholder="请选择是否自动开闸" clearable style="width: 180px;">
              <el-option v-for="dict in is_auto_open" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否录入车辆" prop="isRegis">
            <el-select v-model="queryParams.isRegis" placeholder="请选择是否录入车辆" clearable style="width: 180px;">
              <el-option v-for="dict in is_regis" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="禁行排放等级" prop="emissionState">
            <el-select v-model="queryParams.emissionState" placeholder="请选择禁行排放等级" clearable style="width: 180px;">
              <el-option v-for="dict in emission_state" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="二维码过期时间" prop="qrExpireTime">
            <el-input v-model="queryParams.qrExpireTime" placeholder="请输入过期时间" clearable @keyup.enter="handleQuery"
              style="width: 180px;" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="违规记录上报" prop="violationAutoReport">
            <el-select v-model="queryParams.violationAutoReport" placeholder="请选择违规记录上报" clearable
              style="width: 180px;">
              <el-option v-for="dict in int_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="违规报警" prop="violationAlarm">
            <el-select v-model="queryParams.violationAlarm" placeholder="请选择违规报警" clearable style="width: 180px;">
              <el-option v-for="dict in int_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否接入接口平台" prop="isOnline">
            <el-select v-model="queryParams.isOnline" placeholder="请选择是否接入接口平台" clearable style="width: 180px;">
              <el-option v-for="dict in int_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="20" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['system:enterpriseConfig:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:enterpriseConfig:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:enterpriseConfig:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['system:enterpriseConfig:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-row :gutter="20">
      <el-col v-for="item in enterpriseConfigList" :key="item.id" :span="8">
        <el-card class="box-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon>
                  <Office />
                </el-icon>
                <span class="title">{{ getCompanyName(item.companyId) }}</span>
              </div>
              <el-button type="primary" :icon="Edit" link @click="handleUpdate(item)"
                v-hasPermi="['system:enterpriseConfig:edit']">修改</el-button>
            </div>
          </template>
          <div class="card-body">
            <div class="info-item">
              <span class="label">
                <el-icon>
                  <Unlock />
                </el-icon>
                是否自动开闸:
              </span>
              <dict-tag :options="is_auto_open" :value="item.isAutoOpen" />
            </div>
            <div class="info-item">
              <span class="label">
                <el-icon>
                  <Van />
                </el-icon>
                是否录入车辆:
              </span>
              <dict-tag :options="is_regis" :value="item.isRegis" />
            </div>
            <div class="info-item">
              <span class="label">
                <el-icon>
                  <Warning />
                </el-icon>
                禁行排放等级:
              </span>
              <dict-tag :options="emission_state" :value="item.emissionState" />
            </div>
            <div class="info-item">
              <span class="label">
                <el-icon>
                  <Timer />
                </el-icon>
                二维码过期时间:
              </span>
              <span class="value">{{ item.qrExpireTime }} 秒</span>
            </div>
            <div class="info-item">
              <span class="label">
                <el-icon>
                  <Bell />
                </el-icon>
                违规记录自动上传:
              </span>
              <dict-tag :options="is_auto_report" :value="item.violationAutoReport" />
            </div>
            <div class="info-item">
              <span class="label">
                <el-icon>
                  <Bell />
                </el-icon>
                违规报警:
              </span>
              <dict-tag :options="int_yes_no" :value="item.violationAlarm" />
            </div>
            <div class="info-item">
              <span class="label">
                <el-icon>
                  <Unlock />
                </el-icon>
                是否接入接口平台:
              </span>
              <dict-tag :options="int_yes_no" :value="item.isOnline" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" hide-on-single-page />

    <!-- 添加或修改企业详细配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="enterpriseConfigRef" :model="formData" :rules="rules" label-width="180px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="企业名称" prop="companyId">
              <el-select v-model="formData.companyId" placeholder="请选择企业" clearable filterable>
                <el-option v-for="item in enterpriseIds" :key="item.companyId" :label="item.companyName"
                  :value="item.companyId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否自动开闸" prop="isAutoOpen">
              <el-radio-group v-model="formData.isAutoOpen">
                <el-radio v-for="dict in is_auto_open" :key="dict.value" :label="parseInt(dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否录入车辆" prop="isRegis">
              <el-radio-group v-model="formData.isRegis">
                <el-radio v-for="dict in is_regis" :key="dict.value" :label="parseInt(dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="禁行排放等级" prop="emissionState">
              <el-select v-model="formData.emissionState" placeholder="请选择禁行排放等级">
                <el-option v-for="dict in emission_state" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" :disabled="[].includes(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="动态二维码过期时间" prop="qrExpireTime" label-width="180">
              <el-input-number v-model="formData.qrExpireTime" :min="30" :step="10" controls-position="right"
                style="width: 180px" class="custom-input-number">
                <template #prefix>
                  <el-icon>
                    <Timer />
                  </el-icon>
                </template>
                <template #append>
                  <span class="append-text">秒</span>
                </template>
              </el-input-number>
              <div class="append-text" v-if="formData.qrExpireTime">
                秒
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="违规记录自动上报" prop="violationAutoReport">
              <el-radio-group v-model="formData.violationAutoReport">
                <el-radio v-for="dict in is_auto_report" :key="dict.value" :label="parseInt(dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="违规报警" prop="violationAlarm">
              <el-radio-group v-model="formData.violationAlarm">
                <el-radio v-for="dict in int_yes_no" :key="dict.value" :label="parseInt(dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否接入接口平台" prop="isOnline">
              <el-radio-group v-model="formData.isOnline">
                <el-radio v-for="dict in int_yes_no" :key="dict.value" :label="parseInt(dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="EnterpriseConfig">
import { listEnterpriseConfig, getEnterpriseConfig, delEnterpriseConfig, addEnterpriseConfig, updateEnterpriseConfig } from "@/api/system/enterpriseConfig";
import { selectIds } from "@/api/system/info";

const { proxy } = getCurrentInstance();
const { is_regis, is_auto_report, is_auto_open, emission_state, int_yes_no } = proxy.useDict('is_regis', 'is_auto_report', 'is_auto_open', 'emission_state', 'int_yes_no');

const enterpriseConfigList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const enterpriseIds = ref([]);

const data = reactive({
  formData: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    isAutoOpen: null,
    isRegis: null,
    emissionState: null,
    qrExpireTime: null,
    violationAutoReport: null,
    violationAlarm: null
  },
  rules: {
    companyId: [
      { required: true, message: "企业名称不能为空", trigger: "change" }
    ],
    isAutoOpen: [
      { required: true, message: "是否自动开闸不能为空", trigger: "change" }
    ],
    isRegis: [
      { required: true, message: "是否录入车辆不能为空", trigger: "change" }
    ],
    emissionState: [
      { required: true, message: "禁行排放等级不能为空", trigger: "change" }
    ],
    qrExpireTime: [
      { required: true, message: "动态二维码过期时间不能为空", trigger: "blur" }
    ],
    violationAutoReport: [
      { required: true, message: "违规记录上报不能为空", trigger: "change" }
    ],
    violationAlarm: [
      { required: true, message: "违规报警不能为空", trigger: "change" }
    ],
    isOnline: [
      { required: true, message: "请选择是否接入接口平台", trigger: "change" }
    ]
  }
});

const { queryParams, formData, rules } = toRefs(data);

/** 查询企业详细配置列表 */
function getList() {
  loading.value = true;
  listEnterpriseConfig(queryParams.value).then(response => {
    enterpriseConfigList.value = response.rows;
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
  formData.value = {
    id: null,
    companyId: null,
    isAutoOpen: null,
    isRegis: null,
    emissionState: null,
    qrExpireTime: null,
    violationAutoReport: null,
    violationAlarm: null,
    isOnline: null
  };
  proxy.resetForm("enterpriseConfigRef");
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
  title.value = "添加企业详细配置";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEnterpriseConfig(_id).then(response => {
    formData.value = response.data;
    open.value = true;
    title.value = "修改企业详细配置";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["enterpriseConfigRef"].validate(valid => {
    if (valid) {
      if (formData.value.id != null) {
        updateEnterpriseConfig(formData.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEnterpriseConfig(formData.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除企业详细配置编号为"' + _ids + '"的数据项？').then(function () {
    return delEnterpriseConfig(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/enterpriseConfig/export', {
    ...queryParams.value
  }, `enterpriseConfig_${new Date().getTime()}.xlsx`)
}

async function getEnterpriseList() {
  try {
    const response = await selectIds();
    enterpriseIds.value = response.rows;
    console.log(enterpriseIds.value);
  } catch (error) {
    console.log("获取企业列表失败", error);
  }
}

getEnterpriseList();
getList();

const getCompanyName = (companyId) => {
  const company = enterpriseIds.value.find(item => item.companyId === companyId);
  return company ? company.companyName : '未知企业'; // 如果找不到，返回默认值
};
</script>

<style scoped>
.box-card {
  margin-bottom: 10px;
  transition: all 0.3s;
}

.box-card:hover {
  box-shadow: 0 4px 12px rgba(85, 85, 85, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .el-icon {
  margin-right: 8px;
  color: var(--el-color-primary);
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.info-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.info-item .label {
  min-width: 140px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.info-item .label .el-icon {
  margin-right: 8px;
  color: var(--el-color-primary);
}

.info-item :deep(.el-tag),
.info-item .value {
  margin-left: auto;
}

.custom-input-number :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color-lighter) inset;
}
</style>
