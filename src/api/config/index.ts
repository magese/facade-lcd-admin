import { request } from '@/utils/service'
import type * as Config from './types/config'
import { AxiosResponse } from 'axios'

export function uploadApi(data: FormData) {
  return request({
    url: 'config/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function pageApi(data: Config.ConfigPageRequest) {
  return request<Config.ConfigPageResponse>({
    url: 'config/page',
    method: 'post',
    data
  })
}

export function editApi(data: Config.ConfigEditRequest) {
  return request({
    url: 'config/edit',
    method: 'post',
    data
  })
}

export function deleteApi(data: Config.ConfigDeleteRequest) {
  return request({
    url: 'config/delete',
    method: 'post',
    data
  })
}

export function exportApi(data: Config.ConfigExportRequest) {
  return request<AxiosResponse>({
    url: 'config/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
