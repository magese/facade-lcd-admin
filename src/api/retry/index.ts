import { request } from '@/utils/service'
import type * as Retry from './types/retry'

export function byConfigIdApi(data: Retry.RetryByConfigIdRequest) {
  return request<Record.RecordPageResponse>({
    url: 'retry/by-config-id',
    method: 'post',
    data
  })
}

export function byRecordIdApi(data: Retry.RetryByRecordIdRequest) {
  return request({
    url: 'retry/by-record-id',
    method: 'post',
    data
  })
}
