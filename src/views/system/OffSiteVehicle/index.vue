<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="公司id" prop="companyId">
        <el-input v-model="queryParams.companyId" placeholder="请输入公司id" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber">
        <el-input v-model="queryParams.plateNumber" placeholder="请输入车牌号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="VIN" prop="vin">
        <el-input v-model="queryParams.vin" placeholder="请输入VIN" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车辆类型" prop="vehicleType">
        <el-select v-model="queryParams.vehicleType" placeholder="请选择车辆类型" clearable>
          <el-option v-for="dict in vehicle_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="排放阶段" prop="emissionStage">
        <el-select v-model="queryParams.emissionStage" placeholder="请选择排放阶段" clearable>
          <el-option v-for="dict in emission_standard" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="环保等级编码" prop="environmentalRatingCode">
        <el-input v-model="queryParams.environmentalRatingCode" placeholder="请输入环保等级编码" clearable
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="品牌型号" prop="brandModel">
        <el-input v-model="queryParams.brandModel" placeholder="请输入品牌型号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车牌颜色" prop="plateColor">
        <el-select v-model="queryParams.plateColor" placeholder="请选择车牌颜色" clearable>
          <el-option v-for="dict in plate_color" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="使用性质" prop="usageProperty">
        <el-input v-model="queryParams.usageProperty" placeholder="请输入使用性质" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="发动机号" prop="engineNumber">
        <el-input v-model="queryParams.engineNumber" placeholder="请输入发动机号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="来访事由" prop="inReason">
        <el-input v-model="queryParams.inReason" placeholder="请输入来访事由" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="车辆所属人" prop="ownerName">
        <el-input v-model="queryParams.ownerName" placeholder="请输入车辆所属人" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="queryParams.address" placeholder="请输入住址" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="核定载人数" prop="loadingCapacity">
        <el-input v-model="queryParams.loadingCapacity" placeholder="请输入核定载人数" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="总质量 (KG)" prop="totalWeight">
        <el-input v-model="queryParams.totalWeight" placeholder="请输入总质量 (KG)" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="燃油类型" prop="fuelType">
        <el-select v-model="queryParams.fuelType" placeholder="请选择燃油类型" clearable>
          <el-option v-for="dict in fuel_type" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          v-hasPermi="['system:OffSiteVehicle:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:OffSiteVehicle:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:OffSiteVehicle:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['system:OffSiteVehicle:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="OffSiteVehicleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="自增主键" align="center" prop="id" /> -->
      <!-- <el-table-column label="公司id" align="center" prop="companyId" /> -->
      <el-table-column label="车牌号" align="center" prop="plateNumber" />
      <el-table-column label="VIN" align="center" prop="vin" />
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
      <el-table-column label="环保等级编码" align="center" prop="environmentalRatingCode" />
      <el-table-column label="品牌型号" align="center" prop="brandModel" />
      <el-table-column label="车牌颜色" align="center" prop="plateColor">
        <template #default="scope">
          <dict-tag :options="plate_color" :value="scope.row.plateColor" />
        </template>
      </el-table-column>
      <el-table-column label="使用性质" align="center" prop="usageProperty">
        <template #default="scope">
          <dict-tag :options="usage_property" :value="scope.row.usageProperty" />
        </template>
      </el-table-column>
      <el-table-column label="发动机号" align="center" prop="engineNumber" />
      <el-table-column label="来访事由" align="center" prop="inReason" />
      <el-table-column label="车辆所属人" align="center" prop="ownerName" />
      <el-table-column label="住址" align="center" prop="address" />
      <el-table-column label="核定载人数" align="center" prop="loadingCapacity" />
      <el-table-column label="总质量 (KG)" align="center" prop="totalWeight" />
      <el-table-column label="燃油类型" align="center" prop="fuelType">
        <template #default="scope">
          <dict-tag :options="fuel_type" :value="scope.row.fuelType" />
        </template>
      </el-table-column>
      <el-table-column label="场外车辆状态" align="center" prop="vehicleStatus" />
      <!-- <el-table-column label="随车清单状态" align="center" prop="fileSyncStatus" /> -->
      <el-table-column label="行驶证图片" align="center" prop="drivingImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.drivingImage" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="车辆图片" align="center" prop="chassisImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.chassisImage" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="随车清单" align="center" prop="accompanyingDocumentsImage" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.accompanyingDocumentsImage" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:OffSiteVehicle:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:OffSiteVehicle:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改场外车辆信息对话框 -->
    <el-dialog :title="title" v-model="open" width="35%" append-to-body>
      <el-form ref="OffSiteVehicleRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="公司id" prop="companyId">
          <el-input v-model="form.companyId" placeholder="请输入公司id" />
        </el-form-item>
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="VIN" prop="vin">
          <el-input v-model="form.vin" placeholder="请输入VIN" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleType" filterable>
          <el-select v-model="form.vehicleType" placeholder="请选择车辆类型">
            <el-option v-for="dict in vehicle_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排放阶段" prop="emissionStage">
          <el-select v-model="form.emissionStage" placeholder="请选择排放阶段">
            <el-option v-for="dict in emission_standard" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环保等级编码" prop="environmentalRatingCode">
          <el-input v-model="form.environmentalRatingCode" placeholder="请输入环保等级编码" />
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
        <el-form-item label="车牌颜色" prop="plateColor">
          <el-select v-model="form.plateColor" placeholder="请选择车牌颜色">
            <el-option v-for="dict in plate_color" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用性质" prop="usageProperty">
          <el-select v-model="form.usageProperty" placeholder="请选择车牌颜色">
            <el-option v-for="dict in usage_property" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发动机号" prop="engineNumber">
          <el-input v-model="form.engineNumber" placeholder="请输入发动机号" />
        </el-form-item>
        <el-form-item label="来访事由" prop="inReason">
          <el-input v-model="form.inReason" placeholder="请输入来访事由" />
        </el-form-item>
        <el-form-item label="车辆所属人" prop="ownerName">
          <el-input v-model="form.ownerName" placeholder="请输入车辆所属人" />
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model="form.address" placeholder="请输入住址" />
        </el-form-item>
        <el-form-item label="核定载人数" prop="loadingCapacity">
          <el-input v-model="form.loadingCapacity" placeholder="请输入核定载人数" />
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
        <!-- <el-form-item label="OBD" prop="hasObd">
          <el-input v-model="form.hasObd" placeholder="请输入OBD" />
        </el-form-item> -->
        <el-form-item label="OBD" prop="fuelType">
          <el-select v-model="form.hasObd" placeholder="请选择是否加装OBD">
            <el-option v-for="dict in has_obd" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行驶证图片" prop="drivingImage">
          <image-upload v-model="form.drivingImage" />
        </el-form-item>
        <el-form-item label="车辆图片" prop="chassisImage">
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

<script setup name="OffSiteVehicle">
import { listOffSiteVehicle, getOffSiteVehicle, delOffSiteVehicle, addOffSiteVehicle, updateOffSiteVehicle } from "@/api/system/OffSiteVehicle";

const { proxy } = getCurrentInstance();
const { plate_color, emission_standard, fuel_type, vehicle_type, usage_property ,has_obd} = proxy.useDict('plate_color', 'emission_standard', 'fuel_type', 'vehicle_type', 'usage_property','has_obd');

const OffSiteVehicleList = ref([]);
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
    plateNumber: null,
    vin: null,
    vehicleType: null,
    emissionStage: null,
    environmentalRatingCode: null,
    brandModel: null,
    plateColor: null,
    usageProperty: null,
    engineNumber: null,
    inReason: null,
    ownerName: null,
    address: null,
    loadingCapacity: null,
    totalWeight: null,
    fuelType: null,
    vehicleStatus: null,
    fileSyncStatus: null,
    drivingImage: null,
    chassisImage: null,
    accompanyingDocumentsImage: null
  },
  rules: {
    companyId: [{ required: true, message: '公司id不能为空', trigger: 'blur' }],
    plateNumber: [
      { required: true, message: '车牌号不能为空', trigger: 'blur' },
      { min: 7, max: 7, message: '车牌号必须是七个字符', trigger: 'blur' }
    ],
    vin: [
      { required: true, message: 'VIN不能为空', trigger: 'blur' },
      { len: 17, message: 'VIN必须是17位字符', trigger: 'blur' }
    ],
    vehicleType: [{ required: true, message: '车辆类型不能为空', trigger: 'blur' }],
    emissionStage: [{ required: true, message: '排放标准不能为空', trigger: 'blur' }],
    brandModel: [{ required: true, message: '品牌型号不能为空', trigger: 'blur' }],
    registrationDate: [{ required: true, message: '注册日期不能为空', trigger: 'blur' }],
    plateColor: [{ required: true, message: '车牌颜色不能为空', trigger: 'blur' }],
    usageProperty: [{ required: true, message: '使用性质不能为空', trigger: 'blur' }],
    engineNumber: [{ required: true, message: '发动机号不能为空', trigger: 'blur' }],
    ownerName: [{ required: true, message: '车辆所属人不能为空', trigger: 'blur' }],
    loadingCapacity: [{ required: true, message: '核定载人数不能为空', trigger: 'blur' }],
    totalWeight: [{ required: true, message: '总质量 (KG)不能为空', trigger: 'blur' }],
    fuelType: [{ required: true, message: '燃油类型不能为空', trigger: 'blur' }],
    hasObd: [{ required: true, message: 'OBD不能为空', trigger: 'blur' }],
    ownerPhone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
    fleetName: [{ required: true, message: '车队名称不能为空', trigger: 'blur' }],
    drivingImage: [{ required: true, message: '行驶证图片不能为空', trigger: 'change' }],
    chassisImage: [{ required: true, message: '车辆图片不能为空', trigger: 'change' }],
    accompanyingDocumentsImage: [{ required: true, message: '随车清单不能为空', trigger: 'change' }],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询场外车辆信息列表 */
function getList() {
  loading.value = true;
  listOffSiteVehicle(queryParams.value).then(response => {
    OffSiteVehicleList.value = response.rows;
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
    plateNumber: null,
    vin: null,
    vehicleType: null,
    emissionStage: null,
    environmentalRatingCode: null,
    brandModel: null,
    registrationDate: null,
    certDate: null,
    plateColor: null,
    usageProperty: null,
    engineNumber: null,
    inReason: null,
    ownerName: null,
    address: null,
    loadingCapacity: null,
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
  proxy.resetForm("OffSiteVehicleRef");
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
  title.value = "添加场外车辆信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getOffSiteVehicle(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改场外车辆信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["OffSiteVehicleRef"].validate(valid => {
    if (valid) {
      
      if (form.value.id != null) {
        updateOffSiteVehicle(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        form.vehicleStatus = 0 // 未认证市局
        addOffSiteVehicle(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除场外车辆信息编号为"' + _ids + '"的数据项？').then(function () {
    return delOffSiteVehicle(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/OffSiteVehicle/export', {
    ...queryParams.value
  }, `OffSiteVehicle_${new Date().getTime()}.xlsx`)
}

getList();
</script>
