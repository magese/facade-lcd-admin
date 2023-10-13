<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { editApi, pageApi } from '@/api/config'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { CirclePlus, Plus, Minus, Refresh, RefreshRight, Search } from '@element-plus/icons-vue'
import { usePagination } from '@/hooks/usePagination'
import { ConfigData, SourceFile } from '@/api/config/types/config'
import { useRouter } from 'vue-router'

defineOptions({
  // 命名当前组件
  name: 'LcdConfig'
})

const router = useRouter()
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const drawerVisible = ref<boolean>(false)
const isView = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  id: '',
  configName: '',
  channelCode: '',
  merchantCode: '',
  prodCode: '',
  channelName: '',
  execType: 'day',
  execTiming: '',
  execGap: 1,
  retryLimit: 1,
  retryGap: 5,
  pullType: '',
  fileType: '',
  pullDateOffset: -1,
  targetFileExt: '.tar.gz',
  signature: 0,
  callback: 0,
  callbackType: 'pdf',
  callbackZipFileName: '',
  callbackProtocolType: '',
  callbackFilePath: '',
  callbackFileName: '',
  okFileType: '',
  okFileName: '',
  realtimeBeginTime: '',
  sourceFiles: [] as SourceFile[]
})
const formRules: FormRules = reactive({
  configName: [{ required: true, trigger: 'blur', message: '请输入配置名称' }],
  channelCode: [{ required: true, trigger: 'blur', message: '请输入渠道号' }],
  merchantCode: [{ required: true, trigger: 'blur', message: '请输入商户号' }],
  prodCode: [{ required: true, trigger: 'blur', message: '请输入产品号' }],
  channelName: [{ required: true, trigger: 'blur', message: '请输入渠道名称' }],
  execType: [{ required: true, trigger: 'blur', message: '请选择单位类型' }],
  execTiming: [{ required: true, trigger: 'blur', message: '请输入开始时间' }],
  execGap: [{ required: true, trigger: 'blur', message: '请输入执行间隔' }],
  retryLimit: [{ required: true, trigger: 'blur', message: '请输入重试次数' }],
  retryGap: [{ required: true, trigger: 'blur', message: '请输入重试间隔分钟' }],
  pullType: [{ required: true, trigger: 'blur', message: '请选择拉取类型' }],
  fileType: [{ required: true, trigger: 'blur', message: '请输入文件类型' }],
  pullDateOffset: [{ required: true, trigger: 'blur', message: '请输入日期偏移量' }],
  targetFileExt: [{ required: true, trigger: 'blur', message: '请输入目标文件后缀' }],
  signature: [{ required: true, trigger: 'blur', message: '请选择是否签章' }],
  callback: [{ required: true, trigger: 'blur', message: '请选择是否回传' }]
})
const protocolTypes = reactive([{ protocol: '', sign: true, accept: false }])
const handleEdit = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (protocolTypes[0].protocol != '') {
        const types: string[] = []
        protocolTypes.forEach((pt) => {
          if (pt.protocol != '') {
            types.push(pt.protocol + (pt.sign ? '' : '-noSign') + (pt.accept ? '-loanAdvanceAccept' : ''))
          }
        })
        formData.callbackProtocolType = types.join(',')
      }
      if (currentUpdateId.value === undefined) {
        editApi(formData)
          .then(() => {
            ElMessage.success('新增成功')
            getPageData()
          })
          .finally(() => {
            drawerVisible.value = false
          })
      } else {
        editApi(formData)
          .then(() => {
            ElMessage.success('修改成功')
            getPageData()
          })
          .finally(() => {
            drawerVisible.value = false
          })
      }
    } else {
      console.error('表单校验不通过', fields)
    }
  })
}
const resetForm = () => {
  formRef.value?.resetFields()
  currentUpdateId.value = undefined
  formData.id = ''
  formData.configName = ''
  formData.channelCode = ''
  formData.merchantCode = ''
  formData.prodCode = ''
  formData.channelName = ''
  formData.execType = ''
  formData.execTiming = ''
  formData.execGap = 0
  formData.retryLimit = 0
  formData.pullType = ''
  formData.pullDateOffset = -1
  formData.targetFileExt = ''
  formData.signature = 0
  formData.callback = 0
  formData.callbackType = 'pdf'
  formData.callbackZipFileName = ''
  formData.callbackProtocolType = ''
  formData.callbackFilePath = ''
  formData.callbackFileName = ''
  formData.okFileType = ''
  formData.okFileName = ''
  formData.realtimeBeginTime = ''
  formData.sourceFiles = []
}

const delSourceFile = (index: number) => {
  formData.sourceFiles.splice(index, 1)
}

const addSourceFile = (index: number) => {
  const defaultSourceFile = {
    id: '',
    sourceType: '',
    fileDesc: '',
    filePath: '',
    fileName: '',
    checkFileName: '',
    checkFileType: 'default',
    fileExt: '',
    decryption: 'NONE',
    unzip: 0,
    unzipFileName: '',
    serialNoRegex: '',
    callbackKeyRegex: '',
    addLcdPrefix: 0,
    required: 1,
    renameTo: ''
  }
  if (index >= 0) {
    formData.sourceFiles.push(formData.sourceFiles[index])
  } else {
    formData.sourceFiles.push(defaultSourceFile)
  }
}

const addProtocol = () => {
  protocolTypes.push({ protocol: '', sign: true, accept: false })
}

const delProtocol = (index: number) => {
  protocolTypes.splice(index, 1)
}

const currentUpdateId = ref<undefined | string>(undefined)
const handleRecords = (row: ConfigData) => {
  console.log(row.id)
  router.push({
    name: 'LcdRecord',
    query: {
      id: row.id
    }
  })
}

const handleUpdate = (row: ConfigData) => {
  currentUpdateId.value = row.id
  drawerVisible.value = true
  Object.assign(formData, row)
}

const handleView = (row: ConfigData) => {
  isView.value = true
  drawerVisible.value = true
  Object.assign(formData, row)
}

const tableData = ref<ConfigData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  configName: '',
  channelCode: '',
  channelName: '',
  pullType: '',
  fileType: ''
})
const getPageData = () => {
  loading.value = true
  pageApi({
    currPage: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    configName: searchData.configName || '',
    channelCode: searchData.channelCode || '',
    channelName: searchData.channelName || '',
    pullType: searchData.pullType || '',
    fileType: searchData.fileType || ''
  })
    .then((res) => {
      paginationData.total = res.data.totalCount
      tableData.value = res.data.records
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getPageData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getPageData, { immediate: true })
watch(drawerVisible, (n) => {
  if (!n) isView.value = false
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="configName" label="配置名称">
          <el-input v-model="searchData.configName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="channelCode" label="渠道编号">
          <el-input v-model="searchData.channelCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="channelName" label="渠道名称">
          <el-input v-model="searchData.channelName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="pullType" label="拉取类型">
          <el-input v-model="searchData.pullType" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="fileType" label="文件类型">
          <el-input v-model="searchData.fileType" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="drawerVisible = true">新增配置</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getPageData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="configName" label="配置名称" align="center">
            <template #default="scope">
              <el-link type="primary" @click="handleView(scope.row)">{{ scope.row.configName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="channelCode" label="渠道号" align="center" />
          <el-table-column prop="channelName" label="渠道名称" align="center" />
          <el-table-column prop="pullType" label="拉取类型" align="center" />
          <el-table-column prop="fileType" label="文件类型" align="center" />
          <el-table-column prop="fileCount" label="源文件数量" align="center">
            <template #default="scope">
              <el-text>{{ scope.row.sourceFiles?.length }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="signature" label="是否签章" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.signature === 1" type="success" effect="plain">是</el-tag>
              <el-tag v-else type="danger" effect="plain">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="callback" label="是否回传" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.callback === 1" type="success" effect="plain">是</el-tag>
              <el-tag v-else type="danger" effect="plain">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleRecords(scope.row)">查看记录</el-button>
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isView ? '查看配置' : currentUpdateId === undefined ? '新增配置' : '修改配置'"
      @close="resetForm"
      :before-close="(done: () => void) => ElMessageBox.confirm('确认要关闭？').then(() => done())"
      direction="rtl"
      size="45%"
    >
      <template #default>
        <el-form
          class="edit-form"
          ref="formRef"
          :model="formData"
          :rules="formRules"
          :disabled="isView"
          label-width="120px"
          label-position="left"
        >
          <el-timeline>
            <el-timeline-item timestamp="step1" placement="top">
              <el-card>
                <h4>渠道配置</h4>
                <el-form-item prop="id" label="配置ID" v-if="currentUpdateId">
                  <el-input v-model="formData.id" readonly />
                </el-form-item>
                <el-form-item prop="configName" label="配置名称">
                  <el-input v-model="formData.configName" placeholder="请输入配置名称" />
                </el-form-item>
                <el-form-item prop="channelCode" label="渠道号">
                  <el-input v-model="formData.channelCode" placeholder="请输入渠道号" />
                </el-form-item>
                <el-form-item prop="merchantCode" label="商户号">
                  <el-input v-model="formData.merchantCode" placeholder="请输入商户号" />
                </el-form-item>
                <el-form-item prop="prodCode" label="产品号">
                  <el-input v-model="formData.prodCode" placeholder="请输入产品号" />
                </el-form-item>
                <el-form-item prop="channelName" label="渠道名称">
                  <el-input v-model="formData.channelName" placeholder="请输入渠道名称" />
                </el-form-item>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="step2" placement="top">
              <el-card>
                <h4>执行配置</h4>
                <el-form-item prop="execGap" label="执行间隔">
                  <el-input-number v-model="formData.execGap" :min="1" :max="99" />
                </el-form-item>
                <el-form-item prop="execType" label="单位类型">
                  <el-select v-model="formData.execType" placeholder="请选择执行单位类型">
                    <el-option label="day" value="day" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="execTiming" label="开始时间">
                  <el-time-picker v-model="formData.execTiming" placeholder="请选择执行开始时间" />
                </el-form-item>
                <el-form-item prop="retryLimit" label="重试次数">
                  <el-input-number v-model="formData.retryLimit" :min="1" :max="99" />
                </el-form-item>
                <el-form-item prop="retryGap" label="重试间隔分钟">
                  <el-input-number v-model="formData.retryGap" :min="1" :max="99" />
                </el-form-item>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="step3" placement="top">
              <el-card>
                <h4>拉取配置</h4>
                <el-form-item prop="fileType" v-if="formData.pullType && formData.fileType">
                  <el-tag>{{ formData.pullType }}</el-tag>
                  <el-tag type="info">-</el-tag>
                  <el-tag>{{ formData.fileType }}</el-tag>
                </el-form-item>
                <el-form-item prop="fileType" label="拉取类型">
                  <el-input v-model="formData.fileType" placeholder="请输入文件类型" class="input-with-select">
                    <template #prepend>
                      <el-select
                        v-model="formData.pullType"
                        placeholder="请选择拉取类型"
                        style="width: 150px; background-color: var(--el-fill-color-blank)"
                      >
                        <el-option label="账务文件" value="account" />
                        <el-option label="协议文件" value="agreement" />
                        <el-option label="实时回传" value="realtime" />
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="pullDateOffset" label="日期偏移量">
                  <el-input-number v-model="formData.pullDateOffset" :min="-99" :max="99" />
                </el-form-item>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="step4" placement="top">
              <el-card>
                <template #header>
                  <div class="space-between">
                    <h4>源文件配置</h4>
                    <el-button class="button" type="primary" :icon="Plus" circle @click="addSourceFile(-1)" />
                  </div>
                </template>
                <div v-for="(item, index) in formData.sourceFiles" :key="index">
                  <el-input v-model="item.id" style="display: none" />
                  <el-divider>文件{{ index + 1 }}</el-divider>
                  <div style="display: flex; justify-content: end; margin: 10px 0">
                    <el-button
                      class="button"
                      type="danger"
                      size="small"
                      :icon="Minus"
                      text
                      bg
                      circle
                      @click="delSourceFile(index)"
                    />
                    <el-button
                      class="button"
                      type="primary"
                      size="small"
                      :icon="Plus"
                      text
                      bg
                      circle
                      @click="addSourceFile(index)"
                    />
                  </div>
                  <el-form-item prop="sourceType" label="源文件类型">
                    <el-select v-model="item.sourceType" placeholder="请选择源文件类型">
                      <el-option label="SFTP服务器" value="sftp" />
                      <el-option label="HTTP请求" value="http" />
                      <el-option label="Swift核心区" value="swift-core" />
                      <el-option label="Swift渠道区" value="swift-channel" />
                      <el-option label="数据库+Swift渠道区" value="oracle-swift-channel" />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="fileDesc" label="文件描述">
                    <el-input v-model="item.fileDesc" placeholder="请输入文件描述" />
                  </el-form-item>
                  <el-form-item prop="filePath" label="文件路径">
                    <el-input v-model="item.filePath" placeholder="请输入文件路径" />
                  </el-form-item>
                  <el-form-item prop="fileName" label="文件名称">
                    <el-input v-model="item.fileName" placeholder="请输入文件名称" />
                  </el-form-item>
                  <el-form-item prop="checkFileName" label="校验文件名称">
                    <el-input v-model="item.checkFileName" placeholder="请输入校验文件名称" />
                  </el-form-item>
                  <el-form-item prop="checkFileType" label="校验文件类型">
                    <el-select v-model="item.checkFileType" placeholder="请选择校验文件类型">
                      <el-option label="默认校验" value="default" />
                      <el-option label="MD5校验" value="md5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="fileExt" label="文件后缀">
                    <el-input v-model="item.fileExt" placeholder="请输入文件后缀" />
                  </el-form-item>
                  <el-form-item prop="decryption" label="解密类型">
                    <el-select v-model="item.decryption" placeholder="请选择解密类型">
                      <el-option label="不解密" value="NONE" />
                      <el-option label="RSA" value="RSA" />
                      <el-option label="RSA_PKCS8" value="RSA_PKCS8" />
                      <el-option label="AES" value="AES" />
                      <el-option label="DES" value="DES" />
                      <el-option label="插件解密" value="PLUGIN" />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="renameTo" label="重命名">
                    <el-input v-model="item.renameTo" placeholder="请输入重命名" />
                  </el-form-item>
                  <el-form-item prop="serialNoRegex" label="序列号正则">
                    <el-input v-model="item.serialNoRegex" placeholder="请输入序列号提取正则" />
                  </el-form-item>
                  <el-form-item prop="callbackKeyRegex" label="回传Key正则">
                    <el-input v-model="item.callbackKeyRegex" placeholder="请输入回传Key提取正则" />
                  </el-form-item>
                  <el-form-item prop="unzip" label="是否解压">
                    <el-switch v-model="item.unzip" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                  <el-form-item prop="unzipFileName" label="解压文件列表" v-if="item.unzip === 1">
                    <el-input v-model="item.unzipFileName" placeholder="请输入解压文件名称列表" />
                  </el-form-item>
                  <el-form-item prop="addLcdPrefix" label="是否添加前缀">
                    <el-switch v-model="item.addLcdPrefix" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                  <el-form-item prop="required" label="是否必须">
                    <el-switch v-model="item.required" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                </div>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="step4" placement="top">
              <el-card>
                <h4>目标文件配置</h4>
                <el-form-item prop="targetFileExt" label="目标文件后缀">
                  <el-select v-model="formData.targetFileExt" placeholder="请选择目标文件后缀">
                    <el-option label=".tar" value=".tar" />
                    <el-option label=".tar.gz" value=".tar.gz" />
                    <el-option label=".zip" value=".zip" />
                    <el-option label=".txt" value=".txt" />
                    <el-option label="其它" value="other" />
                  </el-select>
                </el-form-item>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="step5" placement="top">
              <el-card>
                <h4>签章配置</h4>
                <el-form-item prop="signature" label="是否签章">
                  <el-switch v-model="formData.signature" :active-value="1" :inactive-value="0" />
                </el-form-item>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="step6" placement="top">
              <el-card>
                <h4>回传配置</h4>
                <el-form-item prop="callback" label="是否回传">
                  <el-switch v-model="formData.callback" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <div v-if="formData.callback === 1">
                  <el-form-item
                    prop="protocolType"
                    :label="index === 0 ? '协议类型列表' : ''"
                    v-for="(item, index) in protocolTypes"
                    :key="index"
                  >
                    <el-input
                      v-model="item.protocol"
                      placeholder="请输入协议类型"
                      style="max-width: 220px; margin-right: 10px"
                    />
                    <el-switch
                      v-model="item.sign"
                      inline-prompt
                      active-text="签章"
                      inactive-text="不需签章"
                      style="width: 75px; margin-right: 10px"
                    />
                    <el-switch
                      v-model="item.accept"
                      inline-prompt
                      active-text="审批通过"
                      inactive-text="不需审批通过"
                      style="width: 150px"
                    />
                    <el-button
                      class="button"
                      type="danger"
                      size="small"
                      :icon="Minus"
                      text
                      bg
                      circle
                      @click="delProtocol(index)"
                      :disabled="index === 0"
                    />
                    <el-button
                      class="button"
                      type="primary"
                      size="small"
                      :icon="Plus"
                      text
                      bg
                      circle
                      @click="addProtocol"
                    />
                  </el-form-item>
                  <el-form-item prop="callbackType" label="回传类型">
                    <el-select v-model="formData.callbackType" placeholder="请选择回传类型">
                      <el-option label="PDF" value="pdf" />
                      <el-option label="ZIP" value="zip" />
                      <el-option label="Kafka" value="kafka" />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="callbackFilePath" label="回传文件路径">
                    <el-input v-model="formData.callbackFilePath" placeholder="请输入回传文件路径" />
                  </el-form-item>
                  <el-form-item prop="callbackFileName" label="回传文件名称">
                    <el-input v-model="formData.callbackFileName" placeholder="请输入回传文件名称" />
                  </el-form-item>
                  <el-form-item prop="callbackZipFileName" label="压缩文件名称" v-if="formData.callbackType === 'zip'">
                    <el-input v-model="formData.callbackZipFileName" placeholder="请输入回传压缩包文件名称" />
                  </el-form-item>
                  <el-form-item prop="realtimeBeginTime" label="回传起始时间" v-if="formData.pullType === 'realtime'">
                    <el-date-picker
                      v-model="formData.realtimeBeginTime"
                      type="datetime"
                      placeholder="请选择实时回传开始时间"
                    />
                  </el-form-item>
                  <el-form-item prop="okFileName" label="OK文件名称">
                    <el-input v-model="formData.okFileName" placeholder="请输入OK文件名称" />
                  </el-form-item>
                  <el-form-item prop="okFileType" label="OK文件类型">
                    <el-input v-model="formData.okFileType" placeholder="请输入OK文件类型" />
                  </el-form-item>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button @click="resetForm" v-if="!isView">重置</el-button>
        <el-button type="primary" @click="handleEdit" v-if="!isView">确认</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-input {
  max-width: 220px;
  &.input-with-select {
    max-width: 320px;
  }
}
</style>
