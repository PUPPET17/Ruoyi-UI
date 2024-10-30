<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px"
      label-position="left">
      <el-row :gutter="0">
        <el-col :span="4">
          <el-form-item label="车牌号码" prop="plateNo">
            <el-tooltip class="item" effect="light" content="支持模糊搜索" placement="bottom">
              <el-input v-model="queryParams.plateNo" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="通行状态" prop="state">
            <el-input v-model="queryParams.state" placeholder="请输入通行状态" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="货物来源地" prop="goodsOrigin">
            <el-tooltip class="item" effect="light" content="支持模糊搜索" placement="bottom">
               <el-input v-model="queryParams.goodsOrigin" placeholder="请输入货物来源地" clearable @keyup.enter="handleQuery" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="货物目的地" prop="goodsDestination">
            <el-tooltip class="item" effect="light" content="支持模糊搜索" placement="bottom">
              <el-input v-model="queryParams.goodsDestination" placeholder="请输入货物目的地" clearable
              @keyup.enter="handleQuery" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="入场日期" prop="startDate">
            <el-date-picker clearable v-model="queryParams.startDate" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择入场日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="出场日期" prop="endDate">
            <el-date-picker clearable v-model="queryParams.endDate" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择出场日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">


      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item label="车辆类型" prop="classifyTitle" style="margin-bottom: 20px;">
            <div class="custom-style">
              <el-segmented v-model="queryParams.classifyTitle"
                :options="classify_title.map(dict => ({ label: dict.label, value: dict.value }))" size="middle" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: right;">
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>



    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['transit:transitrecord:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['transit:transitrecord:edit']">修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['transit:transitrecord:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['transit:transitrecord:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
      <el-table-column label="公司名称" align="center" prop="areaName" />
      <!-- <el-table-column label="公司id" align="center" prop="companyId" /> -->
      <el-table-column label="车牌号码" align="center" prop="plateNo" />
      <el-table-column label="车辆类型" align="center" prop="classifyTitle">
        <template #default="scope">
          <dict-tag :options="classify_title" :value="scope.row.classifyTitle" />
        </template>
      </el-table-column>
      <el-table-column label="车牌颜色码" align="center" prop="plateColorType">
        <template #default="scope">
          <dict-tag :options="plate_color" :value="scope.row.plateColorType" />
        </template>
      </el-table-column>
      <el-table-column label="入场照片" align="center" prop="inImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.inImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="入场车牌照片" align="center" prop="inSmallImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.inSmallImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="出场照片" align="center" prop="outImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.outImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="出场车牌照片" align="center" prop="outSmallImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.outSmallImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通行状态" align="center" prop="state" />
      <!-- <el-table-column label="停留时间" align="center" prop="stopTime" /> -->
      <el-table-column label="电话号码" align="center" prop="tel" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="入场日期" align="center" prop="startDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入场货物名称" align="center" prop="inboundName" />
      <el-table-column label="入场货物质量" align="center" prop="inboundVolume" />
      <el-table-column label="入场货物单位" align="center" prop="inboundUnit" />
      <el-table-column label="出场日期" align="center" prop="endDate" width="130">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出场货物名称" align="center" prop="outboundName" />
      <el-table-column label="出场货物质量" align="center" prop="outboundVolume" />
      <el-table-column label="出场货物单位" align="center" prop="outboundUnit" />
      <el-table-column label="货物来源地" align="center" prop="goodsOrigin" />
      <el-table-column label="货物目的地" align="center" prop="goodsDestination" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['transit:transitrecord:edit']">修改</el-button> -->
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['transit:transitrecord:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改通行记录对话框 -->
    <!-- <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="transitrecordRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车牌号码" prop="plateNo">
          <el-input v-model="form.plateNo" placeholder="请输入车牌号码" />
        </el-form-item>
        <el-form-item label="暂空" prop="cashierID">
          <el-input v-model="form.cashierID" placeholder="请输入暂空" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="classifyTitle">
          <el-input v-model="form.classifyTitle" placeholder="请输入车辆类型" />
        </el-form-item>
        <el-form-item label="车牌颜色" prop="plateColor">
          <el-input v-model="form.plateColor" placeholder="请输入车牌颜色" />
        </el-form-item>
        <el-form-item label="车牌颜色码" prop="plateColorType">
          <el-select v-model="form.plateColorType" placeholder="请选择车牌颜色码">
            <el-option v-for="dict in plate_color" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="暂0" prop="cost">
          <el-input v-model="form.cost" placeholder="请输入暂0" />
        </el-form-item>
        <el-form-item label="入场照片" prop="inImg">
          <image-upload v-model="form.inImg" />
        </el-form-item>
        <el-form-item label="入场车牌照片" prop="inSmallImg">
          <image-upload v-model="form.inSmallImg" />
        </el-form-item>
        <el-form-item label="出场车牌照片" prop="outSmallImg">
          <image-upload v-model="form.outSmallImg" />
        </el-form-item>
        <el-form-item label="出场照片" prop="outImg">
          <image-upload v-model="form.outImg" />
        </el-form-item>
        <el-form-item label="暂0" prop="paidFee">
          <el-input v-model="form.paidFee" placeholder="请输入暂0" />
        </el-form-item>
        <el-form-item label="进出场状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入进出场状态" />
        </el-form-item>
        <el-form-item label="暂空" prop="statisticsId">
          <el-input v-model="form.statisticsId" placeholder="请输入暂空" />
        </el-form-item>
        <el-form-item label="停留时间" prop="stopTime">
          <el-input v-model="form.stopTime" placeholder="请输入停留时间" />
        </el-form-item>
        <el-form-item label="电话号码" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="暂0" prop="unitPrice">
          <el-input v-model="form.unitPrice" placeholder="请输入暂0" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="入场日期" prop="startDate">
          <el-date-picker clearable v-model="form.startDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择入场日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入场货物名称" prop="inboundName">
          <el-input v-model="form.inboundName" placeholder="请输入入场货物名称" />
        </el-form-item>
        <el-form-item label="入场货物质量" prop="inboundVolume">
          <el-input v-model="form.inboundVolume" placeholder="请输入入场货物质量" />
        </el-form-item>
        <el-form-item label="入场货物单位" prop="inboundUnit">
          <el-input v-model="form.inboundUnit" placeholder="请输入入场货物单位" />
        </el-form-item>
        <el-form-item label="出场时间" prop="endDate">
          <el-date-picker clearable v-model="form.endDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择出场时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出场货物名称" prop="outboundName">
          <el-input v-model="form.outboundName" placeholder="请输入出场货物名称" />
        </el-form-item>
        <el-form-item label="出场货物质量" prop="outboundVolume">
          <el-input v-model="form.outboundVolume" placeholder="请输入出场货物质量" />
        </el-form-item>
        <el-form-item label="出场货物单位" prop="outboundUnit">
          <el-input v-model="form.outboundUnit" placeholder="请输入出场货物单位" />
        </el-form-item>
        <el-form-item label="货物来源地" prop="goodsOrigin">
          <el-input v-model="form.goodsOrigin" placeholder="请输入货物来源地" />
        </el-form-item>
        <el-form-item label="货物目的地" prop="goodsDestination">
          <el-input v-model="form.goodsDestination" placeholder="请输入货物目的地" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup name="Record">
import { listRecord, getRecord, delRecord, addRecord, updateRecord } from "@/api/transit/record";

const { proxy } = getCurrentInstance();
const { plate_color, classify_title } = proxy.useDict('plate_color', 'classify_title');

const recordList = ref([]);
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
    createDate: null,
    areaName: null,
    companyId: null,
    plateNo: null,
    carSize: null,
    carType: null,
    cashierID: null,
    classifyTitle: null,
    plateColor: null,
    plateColorType: null,
    cost: null,
    inImg: null,
    inSmallImg: null,
    outSmallImg: null,
    outImg: null,
    paidFee: null,
    parkingType: null,
    state: null,
    statisticsId: null,
    stopTime: null,
    tel: null,
    userName: null,
    cameraSn: null,
    cameraId: null,
    cameraName: null,
    startDate: null,
    inboundName: null,
    inboundVolume: null,
    inboundUnit: null,
    endDate: null,
    outboundName: null,
    outboundVolume: null,
    outboundUnit: null,
    goodsOrigin: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询通行记录列表 */
function getList() {
  loading.value = true;
  listRecord(queryParams.value).then(response => {
    // 将主键 ID 转换为字符串
    recordList.value = response.rows.map(item => ({
      ...item,
      id: item.id.toString() // 确保 ID 是字符串
    }));
    console.log(recordList.value);
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
    createDate: null,
    areaName: null,
    companyId: null,
    plateNo: null,
    carSize: null,
    carType: null,
    cashierID: null,
    classifyTitle: null,
    plateColor: null,
    plateColorType: null,
    cost: null,
    inImg: null,
    inSmallImg: null,
    outSmallImg: null,
    outImg: null,
    paidFee: null,
    parkingType: null,
    state: null,
    statisticsId: null,
    stopTime: null,
    tel: null,
    unitPrice: null,
    userName: null,
    cameraSn: null,
    cameraId: null,
    cameraName: null,
    startDate: null,
    inboundName: null,
    inboundVolume: null,
    inboundUnit: null,
    endDate: null,
    outboundName: null,
    outboundVolume: null,
    outboundUnit: null,
    goodsOrigin: null,
    userId: null,
    deptId: null,
    goodsDestination: null
  };
  proxy.resetForm("transitrecordRef");
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
  title.value = "添加通行记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getRecord(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改通行记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["recordRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRecord(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRecord(form.value).then(response => {
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
  console.log(_ids)
  proxy.$modal.confirm('是否确认删除通行记录编号为"' + _ids + '"的数据项？').then(function () {
    return delRecord(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('transit/record/export', {
    ...queryParams.value
  }, `record_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style scoped>
.custom-style .el-segmented {
  --el-segmented-item-selected-color: #F2F6FC;
  --el-segmented-item-selected-bg-color: #409EFF;
  --el-border-radius-base: 12px;
}
</style>