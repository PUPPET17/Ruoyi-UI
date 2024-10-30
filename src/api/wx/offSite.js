import request from '@/utils/request'

// 新增场外车辆信息
export function addOffSiteVehicle(data) {
  return request({
    url: '/system/OffSiteVehicle',
    method: 'post',
    data: data,
    headers: {
      skipAuth: true
    }
  })
}