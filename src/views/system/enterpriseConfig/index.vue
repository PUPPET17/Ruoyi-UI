<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="是否自动开闸" prop="isAutoOpen">
        <el-select v-model="queryParams.isAutoOpen" placeholder="请选择是否自动开闸" clearable>
          <el-option v-for="dict in is_auto_open" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否录入车辆" prop="isRegis">
        <el-select v-model="queryParams.isRegis" placeholder="请选择是否录入车辆" clearable>
          <el-option v-for="dict in is_regis" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="禁行排放等级" prop="emissionState">
        <el-select v-model="queryParams.emissionState" placeholder="请选择禁行排放等级" clearable>
          <el-option v-for="dict in emission_state" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="动态二维码过期时间" prop="qrExpireTime">
        <el-input v-model="queryParams.qrExpireTime" placeholder="请输入动态二维码过期时间" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="违规记录上报" prop="violationAutoReport">
        <el-select v-model="queryParams.violationAutoReport" placeholder="请选择违规记录上报" clearable>
          <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
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

    <el-table v-loading="loading" :data="enterpriseConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
      <el-table-column label="是否自动开闸" align="center" prop="isAutoOpen">
        <template #default="scope">
          <dict-tag :options="is_auto_open" :value="scope.row.isAutoOpen" />
        </template>
      </el-table-column>
      <el-table-column label="是否录入车辆" align="center" prop="isRegis">
        <template #default="scope">
          <dict-tag :options="is_regis" :value="scope.row.isRegis" />
        </template>
      </el-table-column>
      <el-table-column label="禁行排放等级" align="center" prop="emissionState">
        <template #default="scope">
          <dict-tag :options="emission_state" :value="scope.row.emissionState" />
        </template>
      </el-table-column>
      <el-table-column label="动态二维码过期时间" align="center" prop="qrExpireTime" />
      <el-table-column label="违规记录上报" align="center" prop="violationAutoReport">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.violationAutoReport" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:enterpriseConfig:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:enterpriseConfig:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" hide-on-single-page />

    <!-- 添加或修改企业详细配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="enterpriseConfigRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="是否自动开闸" prop="isAutoOpen">
          <el-radio-group v-model="form.isAutoOpen">
            <el-radio v-for="dict in is_auto_open" :key="dict.value"
              :label="parseInt(dict.value)">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否录入车辆" prop="isRegis">
          <el-radio-group v-model="form.isRegis">
            <el-radio v-for="dict in is_regis" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="禁行排放等级" prop="emissionState">
          <el-select v-model="form.emissionState" placeholder="请选择禁行排放等级">
            <el-option v-for="dict in emission_state" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="动态二维码过期时间" prop="qrExpireTime">
          <el-input v-model="form.qrExpireTime" placeholder="请输入动态二维码过期时间" />
        </el-form-item>
        <el-form-item label="违规记录上报" prop="violationAutoReport">
          <el-radio-group v-model="form.violationAutoReport">
            <el-radio v-for="dict in sys_yes_no" :key="dict.value"
              :label="parseInt(dict.value)">{{ dict.label }}</el-radio>
          </el-radio-group>
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

<script setup name="EnterpriseConfig">
import { listEnterpriseConfig, getEnterpriseConfig, delEnterpriseConfig, addEnterpriseConfig, updateEnterpriseConfig } from "@/api/system/enterpriseConfig";

const { proxy } = getCurrentInstance();
const { is_regis, sys_yes_no, is_auto_open, emission_state } = proxy.useDict('is_regis', 'sys_yes_no', 'is_auto_open', 'emission_state');

const enterpriseConfigList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    isAutoOpen: null,
    isRegis: null,
    emissionState: null,
    qrExpireTime: null,
    violationAutoReport: null
  },
  rules: {
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
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

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
  form.value = {
    id: null,
    companyId: null,
    isAutoOpen: null,
    isRegis: null,
    emissionState: null,
    qrExpireTime: null,
    violationAutoReport: null
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
    form.value = response.data;
    open.value = true;
    title.value = "修改企业详细配置";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["enterpriseConfigRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEnterpriseConfig(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEnterpriseConfig(form.value).then(response => {
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

getList();
</script>
