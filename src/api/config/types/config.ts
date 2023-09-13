export interface ConfigPageRequest {
  currPage: number
  pageSize: number
  configName: string
  channelCode: string
  channelName: string
  pullType: string
  fileType: string
}

export type ConfigPageResponse = ApiResponseData<PageData<ConfigData>>

export interface ConfigData {
  id: string
  createTime: string
  updateTime: string
  configName: string
  channelCode: string
  merchantCode: string
  prodCode: string
  channelName: string
  execType: string
  execTiming: string
  execGap: number
  retryLimit: number
  retryGap: number
  pullType: string
  fileType: string
  pullDateOffset: number
  targetFileExt: string
  signature: number
  callback: number
  callbackType: string
  callbackZipFileName: string
  callbackProtocolType: string
  callbackFilePath: string
  callbackFileName: string
  okFileType: string
  okFileName: string
  realtimeBeginTime: string
  sourceFiles: SourceFile[]
}

export interface ConfigEditRequest {
  id: string
  configName: string
  channelCode: string
  merchantCode: string
  prodCode: string
  channelName: string
  execType: string
  execTiming: string
  execGap: number
  retryLimit: number
  retryGap: number
  pullType: string
  fileType: string
  pullDateOffset: number
  targetFileExt: string
  signature: number
  callback: number
  callbackType: string
  callbackZipFileName: string
  callbackProtocolType: string
  callbackFilePath: string
  callbackFileName: string
  okFileType: string
  okFileName: string
  realtimeBeginTime: string
  sourceFiles: SourceFile[]
}

export interface SourceFile {
  id: string
  sourceType: string
  fileDesc: string
  filePath: string
  fileName: string
  checkFileName: string
  checkFileType: string
  fileExt: string
  decryption: string
  unzip: number
  unzipFileName: string
  serialNoRegex: string
  callbackKeyRegex: string
  addLcdPrefix: number
  required: number
  renameTo: string
}
