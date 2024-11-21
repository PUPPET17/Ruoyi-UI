import request from '@/utils/request'

// 新增场外车辆信息
export function addOffSiteVehicleNoAuth(data) {
  return request({
    url: '/wx/vehicle/addVehicle',
    method: 'post',
    data: data,
    headers: {
      skipAuth: true
    }
  })
}

//开闸消息
export function openGate(companyId,plateNo) {
  return request({
    url: '/wx/vehicle/openGate',
    method: 'get',
    headers: {
      skipAuth: true
    },
    params: {
      companyId: companyId,
      plateNo: plateNo
    }
  })
}