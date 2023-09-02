<script lang="ts" setup>
import {reactive, ref, watch} from 'vue'
import {editApi, pageApi} from '@/api/config'
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from 'element-plus';
import {CirclePlus, Download, Refresh, RefreshRight, Search} from '@element-plus/icons-vue'
import {usePagination} from '@/hooks/usePagination'
import {ConfigData} from '@/api/config/types/config'

defineOptions({
  // 命名当前组件
  name: 'LcdConfig'
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const drawerVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  id: '',
  configName: '',
  channelCode: '',
  merchantCode: '',
  prodCode: '',
  channelName: '',
  execType: '',
  execTiming: '',
  execGap: 0,
  retryLimit: 0,
  pullType: '',
  pullDateOffset: -1,
  targetFileExt: '',
  signature: 0,
  callback: 0,
  callbackType: '',
  callbackZipFileName: '',
  callbackProtocolType: '',
  callbackFilePath: '',
  callbackFileName: '',
  okFileType: '',
  okFileName: '',
  realtimeBeginTime: '',
  sourceFiles: []
})
const formRules: FormRules = reactive({
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
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
  formData.callbackType = ''
  formData.callbackZipFileName = ''
  formData.callbackProtocolType = ''
  formData.callbackFilePath = ''
  formData.callbackFileName = ''
  formData.okFileType = ''
  formData.okFileName = ''
  formData.realtimeBeginTime = ''
  formData.sourceFiles = []
}

const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: ConfigData) => {
  currentUpdateId.value = row.id
  drawerVisible.value = true
}
//#endregion

//#region 查
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
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getPageData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="configName" label="配置名称" align="center" />
          <el-table-column prop="channelCode" label="渠道号" align="center" />
          <el-table-column prop="channelName" label="渠道名称" align="center" />
          <el-table-column prop="pullType" label="拉取类型" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag>
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
      :title="currentUpdateId === undefined ? '新增配置' : '修改配置'"
      @close="resetForm"
      :before-close="(done: () => void) => ElMessageBox.confirm('确认要关闭？').then(() => done())"
      direction="rtl"
      size="45%"
    >
      <template #default>
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
          <el-form-item prop="username" label="用户名">
            <el-input v-model="formData.username" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="password" label="密码" v-if="currentUpdateId === undefined">
            <el-input v-model="formData.password" placeholder="请输入" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
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
</style>
