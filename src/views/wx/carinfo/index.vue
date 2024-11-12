<template>
  <div class="app-container">
    <div class="form-container">
      <!-- 添加或修改场外车辆信息对话框 -->
      <el-form ref="OffSiteVehicleRef" :model="form" :rules="rules" label-width="100px" label-position="right"
        size="large">
        <el-row :gutter="20">
          <!-- <el-form-item label="企业名称" prop="companyId">
    <el-select v-model="form.companyId" placeholder="请选择企业" clearable filterable>
      <el-option v-for="item in enterpriseIds" :key="item.companyId" :label="item.companyName" :value="item.companyId" />
    </el-select>
  </el-form-item> -->

          <el-col :span="24">
            <!-- <el-form-item label="车牌号" prop="plateNumber">
              <plate-input v-model="form.plateNumber"></plate-input>
            </el-form-item> -->
            <el-form-item label="车牌号" prop="plateNumber">
              <el-input v-model="form.plateNumber" placeholder="请输入车牌号" show-word-limit maxlength="8"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="发动机号" prop="engineNumber">
              <el-input v-model="form.engineNumber" placeholder="请输入发动机号" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="VIN" prop="vin">
              <el-input v-model="form.vin" placeholder="请输入VIN" style="width: 270px" autosize show-word-limit
                maxlength="17" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="车辆类型" prop="vehicleType">
              <el-select v-model="form.vehicleType" placeholder="请选择车辆类型" filterable>
                <el-option v-for="dict in vehicle_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="车辆种类" prop="carType">
              <el-select v-model="form.carType" placeholder="请选择车辆种类" filterable>
                <el-option v-for="dict in car_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="排放阶段" prop="emissionStage">
              <el-select v-model="form.emissionStage" placeholder="请选择排放阶段">
                <el-option v-for="dict in emission_standard" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 
  <el-col :span="24">
    <el-form-item label="环保等级编码" prop="environmentalRatingCode">
      <el-input v-model="form.environmentalRatingCode" placeholder="请输入环保等级编码" />
    </el-form-item>
  </el-col>
  -->
          <el-col :span="24">
            <el-form-item label="品牌型号" prop="brandModel">
              <el-input v-model="form.brandModel" placeholder="请输入品牌型号" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="车辆所属人" prop="ownerName">
              <el-input v-model="form.ownerName" placeholder="请输入车辆所属人" @input="onOwnerNameChange" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="住址" prop="address">
              <el-input v-model="form.address" placeholder="请输入车辆所属人住址 (三门峡接口必填)" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="注册日期" prop="registrationDate">
              <el-date-picker clearable v-model="form.registrationDate" type="date" value-format="YYYY-MM-DD"
                :editable=false placeholder="请选择注册日期" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="发证日期" prop="certDate">
              <el-date-picker clearable v-model="form.certDate" type="date" value-format="YYYY-MM-DD" :editable=false
                placeholder="请选择发证日期" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="车牌颜色" prop="plateColor">
              <el-select v-model="form.plateColor" placeholder="请选择车牌颜色">
                <el-option v-for="dict in plate_color" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="使用性质" prop="usageProperty">
              <el-select v-model="form.usageProperty" placeholder="请选择使用性质">
                <el-option v-for="dict in usage_property" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="来访事由" prop="inReason">
              <el-input v-model="form.inReason" placeholder="请输入来访事由" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="核定载人数" prop="loadingCapacity">
              <el-input v-model="form.loadingCapacity" placeholder="请输入核定载人数" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="核载质量" prop="totalWeight">
              <el-input v-model="form.totalWeight" placeholder="请输入核载质量" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="车队名称" prop="fleetName">
              <el-input v-model="form.fleetName" @input="onFleetNameInputChange" placeholder="请输入车队名称" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="燃油类型" prop="fuelType">
              <el-select v-model="form.fuelType" placeholder="请选择燃油类型" size="large">
                <el-option v-for="dict in fuel_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="行驶证图片" prop="drivingImage">
              <image-upload v-model="form.drivingImage" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="车辆图片" prop="chassisImage">
              <image-upload v-model="form.chassisImage" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="随车清单" prop="accompanyingDocumentsImage">
              <image-upload v-model="form.accompanyingDocumentsImage" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div class="form-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue';
import { addOffSiteVehicleNoAuth } from "@/api/wx/offSite";
// import { addOffSiteVehicleNoAuth } from "@/api/system/OffSiteVehicle";
import { useRoute, useRouter } from 'vue-router';

import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const { plate_color, emission_standard, fuel_type, vehicle_type, usage_property, car_type } = proxy.useDict('plate_color', 'emission_standard', 'fuel_type', 'vehicle_type', 'usage_property', 'car_type');
const route = useRoute();
const router = useRouter();

const isFleetNameChanged = ref(false);

const data = reactive({
  form: {
    companyId: null,
    plateNumber: null,
    vin: null,
    vehicleType: null,
    carType: null,
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
  rules: {
    companyId: [{ required: true, message: '公司id不能为空', trigger: 'blur' }],
    plateNumber: [
      { required: true, message: '传统车牌号7个字符，新能源车8个字符', trigger: 'blur' },
      { min: 7, max: 8, message: '传统车牌号7个字符，新能源车8个字符', trigger: 'blur' }
    ],
    vin: [
      { required: true, message: 'VIN不能为空', trigger: 'blur' },
      { len: 17, message: 'VIN必须是17位字符', trigger: 'blur' }
    ],
    vehicleType: [{ required: true, message: '车辆类型不能为空', trigger: 'blur' }],
    carType: [{ required: true, message: '车辆类型不能为空', trigger: 'blur' }],
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
    ownerPhone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
    fleetName: [{ required: true, message: '车队名称不能为空', trigger: 'blur' }],
    drivingImage: [{ required: true, message: '行驶证图片不能为空', trigger: 'change' }],
    chassisImage: [{ required: true, message: '车辆图片不能为空', trigger: 'change' }],
    accompanyingDocumentsImage: [{ required: true, message: '随车清单不能为空', trigger: 'change' }],
  }
});

const { form, rules } = toRefs(data);

// 表单重置
function reset() {
  Object.keys(form.value).forEach(key => {
    form.value[key] = null;
  });
  form.value.companyId = route.query.aid;
}

function onOwnerNameChange(newVal) {
  if (!isFleetNameChanged.value) {
    form.value.fleetName = newVal;
  }
}

// 提交按钮
function submitForm() {
  form.companyId = route.query.aid;
  proxy.$refs["OffSiteVehicleRef"].validate(valid => {
    if (valid) {
      addOffSiteVehicleNoAuth(form.value).then(response => {
        // 判断返回的状态，如果不是200则显示错误信息
        if (response.status === 200) {
          proxy.$modal.msgSuccess("新增成功");
          // reset(); // 提交后重置表单
        } else {
          // 如果接口返回非200状态，显示错误信息
          ElMessage.error(response.msg || "操作失败");
        }
      }).catch(error => {
        // 如果请求失败，捕获异常并显示错误
        ElMessage.error(error.message || "请求失败，请稍后重试");
      });
    }
  });
}


onMounted(() => {
  document.body.addEventListener('touchstart', disableDoubleTapZoom, { passive: false });
  const ocrData = route.query.ocrData;
  const aid =  route.query.aid;
  if (ocrData) {
    try {
      const parsedData = JSON.parse(ocrData);
      // 赋值表单数据
      form.value.companyId = aid;
      form.value.plateNumber = parsedData.vehicleLicenseId || null;
      form.value.vin = parsedData.vehicleIdentificationCode || null;
      form.value.vehicleType = parsedData.vehicleType || null;
      form.value.carType = null;
      form.value.emissionStage = parsedData.emissionStage || null;
      form.value.brandModel = parsedData.vehicleBrandType || null;
      form.value.registrationDate = parsedData.vehicleLicenseDateStart ? formatDate(parsedData.vehicleLicenseDateStart) : null;
      form.value.certDate = parsedData.vehicleLicenseFirstDate ? formatDate(parsedData.vehicleLicenseFirstDate) : null;
      form.value.plateColor = null; 
      form.value.usageProperty = parsedData.vehicleUse || null;
      form.value.engineNumber = parsedData.vehicleEngineId || null;
      form.value.ownerName = parsedData.vehicleLicenseOwner || null;
      form.value.address = parsedData.vehicleLicenseAddress || null;
      form.value.loadingCapacity = null; // 默认值为空
      form.value.totalWeight = parsedData.weight || null;
      form.value.fuelType = parsedData.flueType || null;
      form.value.fleetName = parsedData.vehicleLicenseOwner || null; // 默认用车主名字作为车队名称
      form.value.drivingImage = null; // 可根据实际情况处理
      form.value.chassisImage = null; // 可根据实际情况处理
      form.value.accompanyingDocumentsImage = null; // 可根据实际情况处理
    } catch (error) {
      ElMessage.error('解析 OCR 数据失败:', error);
    }
  }
});

// 格式化日期（如果需要）
function formatDate(dateStr) {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
}

const disableDoubleTapZoom = (e) => {
  if (e.touches.length > 1) {
    e.preventDefault(); // 阻止触摸事件
  }
};
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