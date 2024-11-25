import request from '@/utils/request'

export function getGateList(companyId) {
  return request({
    url: '/system/gate/list',
    method: 'get',
    params: { companyId }
  })
}

export function getDeviceList(gateId) {
  return request({
    url: '/system/device/list',
    method: 'get',
    params: { gateId }
  })
}

export function getGateInfo(id) {
  return request({
    url: '/system/gate/' + id,
    method: 'get',
  })
}

