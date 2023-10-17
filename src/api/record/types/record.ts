export interface RecordPageRequest {
  currPage: number
  pageSize: number
  pullConfigId: string
  channelCode: string
  dataId: string
  fileDate: string
  pullType: string
}

export type RecordPageResponse = ApiResponseData<PageData<RecordData>>

export interface RecordData {
  id: string
  createTime: string
  updateTime: string
  pullConfigId: string
  pullConfigName: string
  channelCode: string
  merchantCode: string
  prodCode: string
  channelName: string
  dataId: string
  status: number
  operatorIp: string
  fileExt: string
  pullType: string
  pullDate: string
  targetFileMd5: string
  targetFileUrl: string
  execTimes: number
  retryGap: number
  signature: number
  callback: number
  callbackType: string
  callbackZipFileName: string
  callbackProtocolType: string
  callbackFilePath: string
  callbackFileName: string
  okFileType: string
  okFileName: string
  pluginClass: string
  lastPullTime: string
  lastSendTime: string
  lastCallbackTime: string
  fileCount: number
  isRealTime: boolean
  realtimeBeginTime: string
}

export interface RecordDeleteRequest {
  id: string
}
