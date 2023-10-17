import { request } from '@/utils/service'
import type * as Record from './types/record'

export function pageApi(data: Record.RecordPageRequest) {
  return request<Record.RecordPageResponse>({
    url: 'record/page',
    method: 'post',
    data
  })
}

export function deleteApi(data: Record.RecordDeleteRequest) {
  return request({
    url: 'record/delete',
    method: 'post',
    data
  })
}
