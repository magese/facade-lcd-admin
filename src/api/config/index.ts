import { request } from '@/utils/service'
import type * as Config from './types/config'

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
