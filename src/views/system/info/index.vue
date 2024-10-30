<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入企业名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="行政区划" prop="region">
        <el-input v-model="queryParams.region" placeholder="请输入行政区划" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="企业id" prop="companyId">
        <el-input v-model="queryParams.companyId" placeholder="请输入企业id" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-date-picker clearable v-model="queryParams.createDate" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="企业编码" prop="identifier">
        <el-input v-model="queryParams.identifier" placeholder="请输入企业编码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="联网状态" prop="isOnline">
        <el-select v-model="queryParams.isOnline" placeholder="请选择联网状态" clearable>
          <el-option v-for="dict in is_online" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="企业地址" prop="address">
        <el-input v-model="queryParams.address" placeholder="请输入企业地址" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="企业评级" prop="level">
        <el-input v-model="queryParams.level" placeholder="请输入企业评级" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="法人代表" prop="legalRpst">
        <el-input v-model="queryParams.legalRpst" placeholder="请输入法人代表" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="ocr收费标准" prop="ocrFeeStandard">
        <el-input v-model="queryParams.ocrFeeStandard" placeholder="请输入ocr收费标准" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="服务费" prop="serviceFee">
        <el-input v-model="queryParams.serviceFee" placeholder="请输入服务费" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="服务失效时间" prop="expireTime">
        <el-date-picker clearable v-model="queryParams.expireTime" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择服务失效时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="自动开闸" prop="isAutoOpen">
        <el-select v-model="queryParams.isAutoOpen" placeholder="请选择自动开闸" clearable>
          <el-option v-for="dict in is_auto_open" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="录入车辆" prop="isRegis">
        <el-select v-model="queryParams.isRegis" placeholder="请选择录入车辆" clearable>
          <el-option v-for="dict in is_regis" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="企业分类" prop="classifi">
        <el-input v-model="queryParams.classifi" placeholder="请输入企业分类" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="禁行排放等级" prop="emissionState">
        <el-select v-model="queryParams.emissionState" placeholder="请选择禁行排放等级" clearable>
          <el-option v-for="dict in emission_state" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="接口平台" prop="apiStrategy">
        <el-select v-model="queryParams.apiStrategy" placeholder="请选择接口平台" clearable>
          <el-option v-for="dict in api_strategy" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="绑定的账户Id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入绑定的账户Id" clearable @keyup.enter="handleQuery" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
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

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业名称" align="center" prop="companyName" />
      <el-table-column label="行政区划" align="center" prop="region" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:info:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
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
        <el-form-item label="企业id" prop="companyId">
          <el-input v-model="form.companyId" placeholder="请输入企业id" />
        </el-form-item>
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from "@/api/system/info";

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

/** 提交按钮 */
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

getList();
</script>
