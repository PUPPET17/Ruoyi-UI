<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" label-position="left">
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入企业名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber">
        <el-input v-model="queryParams.plateNumber" placeholder="请输入车牌号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车牌颜色" prop="plateColor">
        <el-select v-model="queryParams.plateColor" placeholder="请选择车牌颜色" clearable>
          <el-option v-for="dict in plate_color" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆类型" prop="vehicleType">
        <el-select v-model="queryParams.vehicleType" placeholder="请选择车辆类型" clearable>
          <el-option v-for="dict in vehicle_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="排放阶段" prop="emissionStage">
        <el-input v-model="queryParams.emissionStage" placeholder="请输入排放阶段" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="环保登记级编码" prop="environmentalRatingCode">
        <el-input v-model="queryParams.environmentalRatingCode" placeholder="请输入环保登记编码" clearable
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="品牌型号" prop="brandModel">
        <el-input v-model="queryParams.brandModel" placeholder="请输入品牌型号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="VIN" prop="vin">
        <el-input v-model="queryParams.vin" placeholder="请输入VIN" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="使用性质" prop="usageProperty">
        <el-select v-model="queryParams.usageProperty" placeholder="请选择使用性质" clearable>
          <el-option v-for="dict in usage_property" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发动机号" prop="engineNumber">
        <el-input v-model="queryParams.engineNumber" placeholder="请输入发动机号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车辆所属人" prop="ownerName">
        <el-input v-model="queryParams.ownerName" placeholder="请输入车辆所属人" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车队名称" prop="fleetName">
        <el-input v-model="queryParams.fleetName" placeholder="请输入车队名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="燃油类型" prop="fuelType">
        <el-select v-model="queryParams.fuelType" placeholder="请选择燃油类型" clearable>
          <el-option v-for="dict in fuel_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否加装OBD" prop="hasObd">
        <el-input v-model="queryParams.hasObd" placeholder="请输入是否加装OBD" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['system:onSiteVehicle:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:onSiteVehicle:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:onSiteVehicle:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['system:onSiteVehicle:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="onSiteVehicleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业名称" align="center" prop="companyName" />
      <el-table-column label="车牌号" align="center" prop="plateNumber" />
      <el-table-column label="车牌颜色" align="center" prop="plateColor">
        <template #default="scope">
          <dict-tag :options="plate_color" :value="scope.row.plateColor" />
        </template>
      </el-table-column>
      <el-table-column label="车辆类型" align="center" prop="vehicleType">
        <template #default="scope">
          <dict-tag :options="vehicle_type" :value="scope.row.vehicleType" />
        </template>
      </el-table-column>
      <el-table-column label="排放阶段" align="center" prop="emissionStage">
        <template #default="scope">
          <dict-tag :options="emission_standard" :value="scope.row.emissionStage" />
        </template>
      </el-table-column>
      <el-table-column label="环保登记级编码" align="center" prop="environmentalRatingCode" />
      <el-table-column label="品牌型号" align="center" prop="brandModel" />
      <el-table-column label="注册日期" align="center" prop="registrationDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.registrationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发证日期" align="center" prop="certDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.certDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VIN" align="center" prop="vin" />
      <el-table-column label="使用性质" align="center" prop="usageProperty">
        <template #default="scope">
          <dict-tag :options="usage_property" :value="scope.row.usageProperty" />
        </template>
      </el-table-column>
      <el-table-column label="发动机号" align="center" prop="engineNumber" />
      <el-table-column label="车辆所属人" align="center" prop="ownerName" />
      <el-table-column label="总质量 (KG)" align="center" prop="totalWeight" />
      <el-table-column label="车队名称" align="center" prop="fleetName" />
      <el-table-column label="燃油类型" align="center" prop="fuelType">
        <template #default="scope">
          <dict-tag :options="fuel_type" :value="scope.row.fuelType" />
        </template>
      </el-table-column>
      <el-table-column label="场内车辆状态" align="center" prop="vehicleStatus" />
      <el-table-column label="随车清单状态" align="center" prop="fileSyncStatus" />
      <el-table-column label="是否加装OBD" align="center" prop="hasObd" />
      <el-table-column label="行驶证图片" align="center" prop="drivingImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.drivingImage" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="车身图片" align="center" prop="chassisImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.chassisImage" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="随车清单" align="center" prop="accompanyingDocumentsImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.accompanyingDocumentsImage" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:onSiteVehicle:edit']">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:onSiteVehicle:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改场内车辆信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="onSiteVehicleRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司Id" prop="companyId">
          <el-input v-model="form.companyId" placeholder="请输入公司Id" />
        </el-form-item>
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车牌颜色" prop="plateColor">
          <el-select v-model="form.plateColor" placeholder="请选择车牌颜色">
            <el-option v-for="dict in plate_color" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleType">
          <el-select v-model="form.vehicleType" placeholder="请选择车辆类型">
            <el-option v-for="dict in vehicle_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排放阶段" prop="emissionStage">
          <el-input v-model="form.emissionStage" placeholder="请输入排放阶段" />
        </el-form-item>
        <el-form-item label="环保登记级编码" prop="environmentalRatingCode">
          <el-input v-model="form.environmentalRatingCode" placeholder="请输入环保登记级编码" />
        </el-form-item>
        <el-form-item label="品牌型号" prop="brandModel">
          <el-input v-model="form.brandModel" placeholder="请输入品牌型号" />
        </el-form-item>
        <el-form-item label="注册日期" prop="registrationDate">
          <el-date-picker clearable v-model="form.registrationDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择注册日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发证日期" prop="certDate">
          <el-date-picker clearable v-model="form.certDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择发证日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="VIN" prop="vin">
          <el-input v-model="form.vin" placeholder="请输入VIN" />
        </el-form-item>
        <el-form-item label="使用性质" prop="usageProperty">
          <el-select v-model="form.usageProperty" placeholder="请选择使用性质">
            <el-option v-for="dict in usage_property" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发动机号" prop="engineNumber">
          <el-input v-model="form.engineNumber" placeholder="请输入发动机号" />
        </el-form-item>
        <el-form-item label="车辆所属人" prop="ownerName">
          <el-input v-model="form.ownerName" placeholder="请输入车辆所属人" />
        </el-form-item>
        <el-form-item label="总质量 (KG)" prop="totalWeight">
          <el-input v-model="form.totalWeight" placeholder="请输入总质量 (KG)" />
        </el-form-item>
        <el-form-item label="车队名称" prop="fleetName">
          <el-input v-model="form.fleetName" placeholder="请输入车队名称" />
        </el-form-item>
        <el-form-item label="燃油类型" prop="fuelType">
          <el-select v-model="form.fuelType" placeholder="请选择燃油类型">
            <el-option v-for="dict in fuel_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否加装OBD" prop="hasObd">
          <el-input v-model="form.hasObd" placeholder="请输入是否加装OBD" />
        </el-form-item>
        <el-form-item label="行驶证图片" prop="drivingImage">
          <image-upload v-model="form.drivingImage" />
        </el-form-item>
        <el-form-item label="车身图片" prop="chassisImage">
          <image-upload v-model="form.chassisImage" />
        </el-form-item>
        <el-form-item label="随车清单" prop="accompanyingDocumentsImage">
          <image-upload v-model="form.accompanyingDocumentsImage" />
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

<script setup name="OnSiteVehicle">
import { listOnSiteVehicle, getOnSiteVehicle, delOnSiteVehicle, addOnSiteVehicle, updateOnSiteVehicle } from "@/api/system/onSiteVehicle";

const { proxy } = getCurrentInstance();
const { plate_color, usage_property, fuel_type, vehicle_type } = proxy.useDict('plate_color', 'usage_property', 'fuel_type', 'vehicle_type');

const onSiteVehicleList = ref([]);
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
    companyName: null,
    plateNumber: null,
    plateColor: null,
    vehicleType: null,
    emissionStage: null,
    environmentalRatingCode: null,
    brandModel: null,
    vin: null,
    usageProperty: null,
    engineNumber: null,
    ownerName: null,
    fleetName: null,
    fuelType: null,
    vehicleStatus: null,
    fileSyncStatus: null,
    hasObd: null,
    drivingImage: null,
    chassisImage: null,
    accompanyingDocumentsImage: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询场内车辆信息列表 */
function getList() {
  loading.value = true;
  listOnSiteVehicle(queryParams.value).then(response => {
    onSiteVehicleList.value = response.rows;
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
    companyName: null,
    plateNumber: null,
    plateColor: null,
    vehicleType: null,
    emissionStage: null,
    environmentalRatingCode: null,
    brandModel: null,
    registrationDate: null,
    certDate: null,
    vin: null,
    usageProperty: null,
    engineNumber: null,
    ownerName: null,
    totalWeight: null,
    fleetName: null,
    fuelType: null,
    vehicleStatus: null,
    fileSyncStatus: null,
    hasObd: null,
    startTime: null,
    endTime: null,
    drivingImage: null,
    chassisImage: null,
    accompanyingDocumentsImage: null
  };
  proxy.resetForm("onSiteVehicleRef");
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
  title.value = "添加场内车辆信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getOnSiteVehicle(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改场内车辆信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["onSiteVehicleRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateOnSiteVehicle(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOnSiteVehicle(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除场内车辆信息编号为"' + _ids + '"的数据项？').then(function () {
    return delOnSiteVehicle(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/onSiteVehicle/export', {
    ...queryParams.value
  }, `onSiteVehicle_${new Date().getTime()}.xlsx`)
}

getList();
</script>
