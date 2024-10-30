<template>
  <div class="app-container">
    <div class="form-container">
      <el-form ref="OffSiteVehicleRef" :model="form" :rules="rules" label-width="120px" label-position="left">
        <!-- <el-form-item label="公司id" prop="companyId">
            <el-input v-model="form.companyId" placeholder="请输入公司id" />
          </el-form-item> -->
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="VIN" prop="vin">
          <el-input v-model="form.vin" placeholder="请输入VIN" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleType">
          <el-select v-model="form.vehicleType" placeholder="请选择车辆类型" filterable>
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
        <!-- <el-form-item label="环保等级编码" prop="environmentalRatingCode">
            <el-input v-model="form.environmentalRatingCode" placeholder="请输入环保等级编码" />
          </el-form-item> -->
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
        <el-form-item label="核载人数" prop="loadingCapacity">
          <el-input v-model="form.loadingCapacity" placeholder="请输入核载人数" />
        </el-form-item>
        <el-form-item label="核载质量" prop="totalWeight">
          <el-input v-model="form.totalWeight" placeholder="请输入核载质量" />
        </el-form-item>
        <el-form-item label="车队名称" prop="fleetName">
          <el-input v-model="form.fleetName" placeholder="请输入车队名称" />
        </el-form-item>
        <el-form-item label="燃油类型" prop="fuelType">
          <el-select v-model="form.fuelType" placeholder="请选择燃油类型">
            <el-option v-for="dict in fuel_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="OBD" prop="hasObd">
          <el-input v-model="form.hasObd" placeholder="请输入OBD" />
        </el-form-item>
        <el-form-item label="行驶证图片" prop="drivingImage">
          <image-upload v-model="form.drivingImage" />
        </el-form-item>
        <el-form-item label="车辆图片" prop="chassisImage">
          <image-upload v-model="form.chassisImage" />
        </el-form-item>
        <el-form-item label="随车清单图片" prop="accompanyingDocumentsImage">
          <image-upload v-model="form.accompanyingDocumentsImage" />
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue';
import { addOffSiteVehicleNoAuth } from "@/api/system/OffSiteVehicle";
import { useRoute, useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const { plate_color, emission_standard, fuel_type, vehicle_type, usage_property } = proxy.useDict('plate_color', 'emission_standard', 'fuel_type', 'vehicle_type', 'usage_property');
const route = useRoute();
const router = useRouter();

const data = reactive({
  form: {
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
    hasObd: null,
    drivingImage: null,
    chassisImage: null,
    accompanyingDocumentsImage: null
  },
  rules: {}
});

const { form, rules } = toRefs(data);

// 取消按钮
function cancel() {
  reset();
}

// 表单重置
function reset() {
  Object.keys(form.value).forEach(key => {
    form.value[key] = null;
  });
}

// 提交按钮
function submitForm() {
  form.companyId = route.query.aid
  proxy.$refs["OffSiteVehicleRef"].validate(valid => {
    if (valid) {
      addOffSiteVehicleNoAuth(form.value).then(() => {
        proxy.$modal.msgSuccess("新增成功");
        reset(); // 提交后重置表单
      });
    }
  });
}
</script>

<style scoped>
.app-container {
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.el-form-item {
  margin-bottom: 16px;
}

.el-input,
.el-select {
  border-radius: 4px;
  height: 40px;
}

.el-button {
  width: 100%;
  margin-top: 10px;
}

.el-button.type-primary {
  background-color: #409EFF;
  border-color: #409EFF;
}

.el-button.type-primary:hover {
  background-color: #66b1ff;
}

.el-button:hover {
  background-color: #e0e0e0;
}
</style>