<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px"
      label-position="left">
      <el-row :gutter="0">
        <el-col :span="4">
          <el-form-item label="车牌号码" prop="plateNo">
            <el-tooltip class="item" effect="light" content="支持模糊搜索" placement="bottom" popper-class="fade">
              <el-input v-model="queryParams.plateNo" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="货物来源地" prop="goodsOrigin">
            <el-tooltip class="item" effect="light" content="支持模糊搜索" placement="bottom" popper-class="fade">
              <el-input v-model="queryParams.goodsOrigin" placeholder="请输入货物来源地" clearable @keyup.enter="handleQuery" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="货物目的地" prop="goodsDestination">
            <el-tooltip class="item" effect="light" content="支持模糊搜索" placement="bottom" popper-class="fade">
              <el-input v-model="queryParams.goodsDestination" placeholder="请输入货物目的地" clearable
                @keyup.enter="handleQuery" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12" />
        <el-col :span="8">
          <el-form-item label="创建时间" prop="dateRange">
            <el-date-picker v-model="dateRange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%;"
              @change="handleDateRangeChange" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="出场日期" prop="endDate">
            <el-date-picker clearable v-model="queryParams.endDate" type="date" value-format="YYYY-MM-DD"
              placeholder="请选择出场日期" style="width: 100%;" />
          </el-form-item>
        </el-col> -->
        <el-col :span="16" />
        <el-col :span="5">
          <el-form-item label="车辆类型" prop="classifyTitle" style="margin-bottom: 18px;">
            <div class="custom-style">
              <el-segmented v-model="queryParams.classifyTitle"
                :options="classify_title.map(dict => ({ label: dict.label, value: dict.value }))" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="通行状态" prop="state">
            <div class="custom-style">
              <el-segmented v-model="queryParams.state"
                :options="transit_status.map(dict => ({ label: dict.label, value: dict.value }))" />
            </div>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="入场认证状态" prop="inboundCertStatus" label-width="100px">
            <el-select v-model="queryParams.inboundCertStatus" placeholder="请选择入场认证状态" style="width: 180px;">
              <el-option v-for="item in certified" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出场认证状态" prop="outboundCertStatus" label-width="100px">
            <el-select v-model="queryParams.outboundCertStatus" placeholder="请选择出场认证状态" style="width: 180px;">
              <el-option v-for="item in certified" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="24" style="text-align: left;margin-bottom: 20px;">
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
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Refresh" :disabled="multiple" @click="handleReAuth">重新上传记录</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column v-if="columns[0].visible" label="公司名称" align="center" prop="areaName" />
      <el-table-column v-if="columns[1].visible" label="车牌号码" align="center" prop="plateNo" width="100" />
      <el-table-column v-if="columns[2].visible" label="车辆类型" align="center" prop="classifyTitle">
        <template #default="scope">
          <dict-tag :options="classify_title" :value="scope.row.classifyTitle" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[3].visible" label="车牌颜色码" align="center" prop="plateColorType">
        <template #default="scope">
          <dict-tag :options="plate_color" :value="scope.row.plateColorType" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[4].visible" label="入场照片" align="center" prop="inImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.inImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[5].visible" label="入场车身照片" align="center" prop="inSmallImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.inSmallImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[6].visible" label="出场照片" align="center" prop="outImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.outImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[7].visible" label="出场车身照片" align="center" prop="outSmallImg" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.outSmallImg" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[8].visible" label="创建时间" align="center" prop="createDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[9].visible" label="通行状态" align="center" prop="state">
        <template #default="scope">
          <dict-tag :options="transit_status" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[14].visible" label="入场日期" align="center" prop="startDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[10].visible" label="入场放行状态" align="center" prop="inboundAccess" width="120"
        show-overflow-tooltip>
        <template #default="scope">
          <dict-tag :options="inbound_outbound_access" :value="scope.row.inboundAccess" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[18].visible" label="出场日期" align="center" prop="endDate" width="130">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[11].visible" label="出场放行状态" align="center" prop="outboundAccess" width="120"
        show-overflow-tooltip>
        <template #default="scope">
          <dict-tag :options="inbound_outbound_access" :value="scope.row.outboundAccess" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[12].visible" label="电话号码" align="center" prop="tel" />
      <el-table-column v-if="columns[13].visible" label="用户名" align="center" prop="userName" />

      <el-table-column v-if="columns[15].visible" label="入场货物名称" align="center" prop="inboundName" />
      <el-table-column v-if="columns[16].visible" label="入场货物质量" align="center" prop="inboundVolume" />
      <el-table-column v-if="columns[17].visible" label="入场货物单位" align="center" prop="inboundUnit" />

      <el-table-column v-if="columns[19].visible" label="出场货物名称" align="center" prop="outboundName" />
      <el-table-column v-if="columns[20].visible" label="出场货物质量" align="center" prop="outboundVolume" />
      <el-table-column v-if="columns[21].visible" label="出场货物单位" align="center" prop="outboundUnit" />
      <el-table-column v-if="columns[27].visible" label="货物来源地" align="center" prop="goodsOrigin" />
      <el-table-column v-if="columns[28].visible" label="货物目的地" align="center" prop="goodsDestination" />
      <el-table-column v-if="columns[22].visible" label="入场自动补录" align="center" prop="isInboundAutoEntry">
        <template #default="scope">
          <dict-tag :options="auto_cargo_info" :value="scope.row.isInboundAutoEntry" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[23].visible" label="出场自动补录" align="center" prop="isOutboundAutoEntry">
        <template #default="scope">
          <dict-tag :options="auto_cargo_info" :value="scope.row.isOutboundAutoEntry" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[24].visible" label="入场认证" align="center" prop="inboundCertStatus">
        <template #default="scope">
          <dict-tag :options="certified" :value="scope.row.inboundCertStatus" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[25].visible" label="出场认证" align="center" prop="outboundCertStatus">
        <template #default="scope">
          <dict-tag :options="certified" :value="scope.row.outboundCertStatus" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns[26].visible" label="接口信息" align="center" prop="certMessage" width="120"
        show-overflow-tooltip />
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <!-- <el-button size="small" type="primary" @click="handleUpdate(scope.$index, scope.row)">
            Edit
          </el-button> -->
          <el-button size="small" icon="Delete" type="danger" @click="handleDelete(scope.row)"
            v-hasPermi="['transit:transitrecord:remove']" />
          <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['transit:transitrecord:edit']">修改</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" hide-on-single-page/>

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
        <el-form-item label="入场车身照片" prop="inSmallImg">
          <image-upload v-model="form.inSmallImg" />
        </el-form-item>
        <el-form-item label="出场车身照片" prop="outSmallImg">
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
        <el-form-item label="入场货名称" prop="inboundName">
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
import { listRecord, getRecord, delRecord, addRecord, updateRecord, reAuth } from "@/api/transit/record";
import { ref } from "vue";

const { proxy } = getCurrentInstance();
const { plate_color, classify_title, transit_status, certified, auto_cargo_info, inbound_outbound_access } = proxy.useDict('plate_color', 'classify_title', 'transit_status', 'certified', 'auto_cargo_info', 'inbound_outbound_access');

const recordList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    startTime: null,
    endTime: null,
    plateNo: null,
    goodsOrigin: null,
    goodsDestination: null,
    classifyTitle: null,
    state: null
  },
  rules: {
  },
  columns: [
    { key: 'areaName', label: '公司名称', visible: true },
    { key: 'plateNo', label: '车牌号码', visible: true },
    { key: 'classifyTitle', label: '车辆类型', visible: true },
    { key: 'plateColorType', label: '车牌颜色码', visible: true },
    { key: 'inImg', label: '入场照片', visible: true },
    { key: 'inSmallImg', label: '入场车身照片', visible: true },
    { key: 'outImg', label: '出场照片', visible: true },
    { key: 'outSmallImg', label: '出场车身照片', visible: true },
    { key: 'createDate', label: '创建时间', visible: true },
    { key: 'state', label: '通行状态', visible: true },
    { key: 'inboundAccess', label: '入场放行状态', visible: true },
    { key: 'outboundAccess', label: '出场放行状态', visible: true },
    { key: 'tel', label: '电话号码', visible: true },
    { key: 'userName', label: '用户名', visible: true },
    { key: 'startDate', label: '入场日期', visible: true },
    { key: 'inboundName', label: '入场货物名称', visible: true },
    { key: 'inboundVolume', label: '入场货物质量', visible: true },
    { key: 'inboundUnit', label: '入场货物单位', visible: true },
    { key: 'endDate', label: '出场日期', visible: true },
    { key: 'outboundName', label: '出场货物名称', visible: true },
    { key: 'outboundVolume', label: '出场货物质量', visible: true },
    { key: 'outboundUnit', label: '出场货物单位', visible: true },
    { key: 'isInboundAutoEntry', label: '入场自动补录', visible: true },
    { key: 'isOutboundAutoEntry', label: '出场自动补录', visible: true },
    { key: 'inboundCertStatus', label: '入场认证状态', visible: true },
    { key: 'outboundCertStatus', label: '出场认证状态', visible: true },
    { key: 'certMessage', label: '接口信息', visible: true },
    { key: 'goodsOrigin', label: '货物来源地', visible: true },
    { key: 'goodsDestination', label: '货物目的地', visible: true }
  ]
});

const { queryParams, form, rules, columns } = toRefs(data);

/** 查询通行记录列表 */
function getList() {
  loading.value = true;
  console.info("查询参数queryParams: " + JSON.stringify(queryParams.value));
  listRecord(queryParams.value).then(response => {
    // 将主键 ID 转换为字符串
    recordList.value = response.rows.map(item => ({
      ...item,
      state: item.state.toString(),
      id: item.id.toString()
    }));
    console.info(recordList.value);
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
    goodsDestination: null,
    isInboundAutoEntry: null,
    isOutboundAutoEntry: null,
    inboundCertStatus: null,
    outboundCertStatus: null,
    certMessage: null
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
  dateRange.value = [];
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
  const _ids = row.plateNo || ids.value;
  proxy.$modal.confirm('是否删除车牌号为"' + _ids + '"的记录？删除后不可恢复！').then(function () {
    return delRecord(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 重新上传通行记录数据 */
function handleReAuth() {
  let _ids = ids.value;
  _ids = Array.isArray(_ids) ? _ids : [_ids];
  console.log('ids: ' + _ids);
  proxy.$modal.confirm('是否重新上传编号为"' + _ids + '"的记录？').then(function () {
    return reAuth(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("重新上传成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('transit/record/export', {
    ...queryParams.value
  }, `record_${new Date().getTime()}.xlsx`)
}

// 处理日期范围变化
function handleDateRangeChange(val) {
  if (val) {
    queryParams.value.startTime = val[0];
    queryParams.value.endTime = val[1];
  } else {
    queryParams.value.startTime = null;
    queryParams.value.endTime = null;
  }
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
  transition: opacity 0.2s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>