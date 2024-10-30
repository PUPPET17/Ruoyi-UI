<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="企业ID" prop="companyId">
        <el-input
          v-model="queryParams.companyId"
          placeholder="请输入企业ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="企业编码" prop="identifier">
        <el-input v-model="queryParams.identifier" placeholder="请输入企业编码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="相机品牌" prop="cameraBrand">
        <el-select v-model="queryParams.cameraBrand" placeholder="请选择相机品牌" clearable>
          <el-option v-for="dict in camera_brand" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="相机序列号" prop="cameraSn">
        <el-input v-model="queryParams.cameraSn" placeholder="请输入相机序列号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="屏幕品牌" prop="screenBrand">
        <el-select v-model="queryParams.screenBrand" placeholder="请选择屏幕品牌" clearable>
          <el-option v-for="dict in screen_brand" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="屏幕序列号" prop="screenSn">
        <el-input v-model="queryParams.screenSn" placeholder="请输入屏幕序列号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="出入口编号 (A/B/C)" prop="entranceNo">
        <el-select v-model="queryParams.entranceNo" placeholder="请选择出入口编号(A/B/C)" clearable>
          <el-option v-for="dict in entrance_no" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="道闸编号" prop="turnNo">
        <el-input v-model="queryParams.turnNo" placeholder="请输入道闸编号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="道闸名称" prop="turnName">
        <el-input v-model="queryParams.turnName" placeholder="请输入道闸名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="道闸地址" prop="turnAddress">
        <el-input v-model="queryParams.turnAddress" placeholder="请输入道闸地址" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="道闸经度" prop="longitude">
        <el-input v-model="queryParams.longitude" placeholder="请输入道闸经度" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="道闸纬度" prop="latitude">
        <el-input v-model="queryParams.latitude" placeholder="请输入道闸纬度" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="queryParams.ip" placeholder="请输入IP地址" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="道闸负责人" prop="inCharge">
        <el-input v-model="queryParams.inCharge" placeholder="请输入道闸负责人" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="负责人联系方式" prop="inChargeContact">
        <el-input v-model="queryParams.inChargeContact" placeholder="请输入负责人联系方式" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="运维单位联系人" prop="maintenanceContact">
        <el-input v-model="queryParams.maintenanceContact" placeholder="请输入运维单位联系人" clearable
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="运维单位" prop="maintenanceCompany">
        <el-input v-model="queryParams.maintenanceCompany" placeholder="请输入运维单位" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="运维单位联系方式" prop="maintenancePhone">
        <el-input v-model="queryParams.maintenancePhone" placeholder="请输入运维单位联系方式" clearable
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="认证状态" prop="isValid">
        <el-input v-model="queryParams.isValid" placeholder="请输入认证状态" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:gate:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:gate:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:gate:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['system:gate:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业编码" align="center" prop="identifier" />
      <el-table-column label="相机品牌" align="center" prop="cameraBrand">
        <template #default="scope">
          <dict-tag :options="camera_brand" :value="scope.row.cameraBrand" />
        </template>
      </el-table-column>
      <el-table-column label="相机序列号" align="center" prop="cameraSn" />
      <el-table-column label="屏幕品牌" align="center" prop="screenBrand">
        <template #default="scope">
          <dict-tag :options="screen_brand" :value="scope.row.screenBrand" />
        </template>
      </el-table-column>
      <el-table-column label="屏幕序列号" align="center" prop="screenSn" />
      <el-table-column label="出入口编号" align="center" prop="entranceNo">
        <template #default="scope">
          <dict-tag :options="entrance_no" :value="scope.row.entranceNo" />
        </template>
      </el-table-column>
      <el-table-column label="道闸编号" align="center" prop="turnNo" />
      <el-table-column label="道闸名称" align="center" prop="turnName" />
      <el-table-column label="道闸地址" align="center" prop="turnAddress" />
      <el-table-column label="IP地址" align="center" prop="ip" />
      <el-table-column label="道闸负责人" align="center" prop="inCharge" />
      <el-table-column label="负责人联系方式" align="center" prop="inChargeContact" />
      <el-table-column label="运维单位联系人" align="center" prop="maintenanceContact" />
      <el-table-column label="运维单位" align="center" prop="maintenanceCompany" />
      <el-table-column label="运维单位联系方式" align="center" prop="maintenancePhone" />
      <el-table-column label="认证状态" align="center" prop="isValid" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:gate:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:gate:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改道闸管理对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="gateRef" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="企业ID" prop="companyId">
          <el-input v-model="form.companyId" placeholder="请输入企业ID" />
        </el-form-item>
        <el-form-item label="企业编码" prop="identifier">
          <el-input v-model="form.identifier" placeholder="请输入企业编码" />
        </el-form-item>
        <el-form-item label="相机品牌" prop="cameraBrand">
          <el-radio-group v-model="form.cameraBrand">
            <el-radio v-for="dict in camera_brand" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="相机序列号" prop="cameraSn">
          <el-input v-model="form.cameraSn" placeholder="请输入相机序列号" />
        </el-form-item>
        <el-form-item label="屏幕品牌" prop="screenBrand">
          <el-radio-group v-model="form.screenBrand">
            <el-radio v-for="dict in screen_brand" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="屏幕序列号" prop="screenSn">
          <el-input v-model="form.screenSn" placeholder="请输入屏幕序列号" />
        </el-form-item>
        <el-form-item label="出入口编号" prop="entranceNo">
          <el-radio-group v-model="form.entranceNo">
            <el-radio v-for="dict in entrance_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="道闸编号" prop="turnNo">
          <el-input v-model="form.turnNo" placeholder="请输入道闸编号" />
        </el-form-item>
        <el-form-item label="道闸名称" prop="turnName">
          <el-input v-model="form.turnName" placeholder="请输入道闸名称" />
        </el-form-item>
        <el-form-item label="道闸地址" prop="turnAddress">
          <el-input v-model="form.turnAddress" placeholder="请输入道闸地址" />
        </el-form-item>
        <el-form-item label="道闸经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入道闸经度" />
        </el-form-item>
        <el-form-item label="道闸纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入道闸纬度" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="道闸负责人" prop="inCharge">
          <el-input v-model="form.inCharge" placeholder="请输入道闸负责人" />
        </el-form-item>
        <el-form-item label="负责人联系方式" prop="inChargeContact">
          <el-input v-model="form.inChargeContact" placeholder="请输入负责人联系方式" />
        </el-form-item>
        <el-form-item label="运维单位联系人" prop="maintenanceContact">
          <el-input v-model="form.maintenanceContact" placeholder="请输入运维单位联系人" />
        </el-form-item>
        <el-form-item label="运维单位" prop="maintenanceCompany">
          <el-input v-model="form.maintenanceCompany" placeholder="请输入运维单位" />
        </el-form-item>
        <el-form-item label="运维单位联系方式" prop="maintenancePhone">
          <el-input v-model="form.maintenancePhone" placeholder="请输入运维单位联系方式" />
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

<script setup name="Gate">
import { listGate, getGate, delGate, addGate, updateGate } from "@/api/system/gate";

const { proxy } = getCurrentInstance();
const { screen_brand, entrance_no, camera_brand } = proxy.useDict('screen_brand', 'entrance_no', 'camera_brand');

const gateList = ref([]);
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
    companyId: null,
    identifier: null,
    cameraBrand: null,
    cameraSn: null,
    screenBrand: null,
    screenSn: null,
    entranceNo: null,
    turnNo: null,
    turnName: null,
    turnAddress: null,
    longitude: null,
    latitude: null,
    ip: null,
    inCharge: null,
    inChargeContact: null,
    maintenanceContact: null,
    maintenanceCompany: null,
    maintenancePhone: null,
    isValid: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询道闸管理列表 */
function getList() {
  loading.value = true;
  listGate(queryParams.value).then(response => {
    gateList.value = response.rows;
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
    identifier: null,
    cameraBrand: null,
    cameraSn: null,
    screenBrand: null,
    screenSn: null,
    entranceNo: null,
    turnNo: null,
    turnName: null,
    turnAddress: null,
    longitude: null,
    latitude: null,
    ip: null,
    inCharge: null,
    inChargeContact: null,
    maintenanceContact: null,
    maintenanceCompany: null,
    maintenancePhone: null,
    createdDate: null,
    updatedDate: null,
    isValid: null
  };
  proxy.resetForm("gateRef");
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
  title.value = "添加道闸管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getGate(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改道闸管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["gateRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateGate(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addGate(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除道闸管理编号为"' + _ids + '"的数据项？').then(function () {
    return delGate(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/gate/export', {
    ...queryParams.value
  }, `gate_${new Date().getTime()}.xlsx`)
}

getList();
</script>
