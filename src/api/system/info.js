import request from '@/utils/request'

// 查询企业信息列表
export function listInfo(query) {
  return request({
    url: '/system/info/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getInfo(id) {
  return request({
    url: '/system/info/' + id,
    method: 'get'
  })
}

// 新增企业信息
export function addInfo(data) {
  return request({
    url: '/system/info',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateInfo(data) {
  return request({
    url: '/system/info',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delInfo(id) {
  return request({
    url: '/system/info/' + id,
    method: 'delete'
  })
}

export function selectIds(){
  const res = request({
    url: '/system/info/ids',
    method: 'get'
  })
  return res
}

export async function getStaticQrCode(companyId) {
  try {
    const res = await request({
      url: '/qr/static?aid=' + companyId,
      method: 'get',
      responseType: 'arraybuffer'  // Ensure responseType is set for binary data
    });
    console.log("QR Code response:", res);
    return res;
  } catch (error) {
    console.error("Error fetching QR code:", error);
  }
}