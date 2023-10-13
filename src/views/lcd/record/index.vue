<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { pageApi } from '@/api/record'
import { type FormInstance } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { usePagination } from '@/hooks/usePagination'
import { RecordData } from '@/api/record/types/record'
import { useRoute } from 'vue-router'

defineOptions({
  // 命名当前组件
  name: 'LcdRecord'
})

const route = useRoute()
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const tableData = ref<RecordData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  pullConfigId: (route.query.id as string) || ''
})
const getPageData = () => {
  loading.value = true
  pageApi({
    currPage: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    pullConfigId: searchData.pullConfigId || ''
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
        <el-form-item prop="pullConfigId" label="配置ID">
          <el-input v-model="searchData.pullConfigId" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="expand">
            <template #default="props">
              <el-descriptions :border="true">
                <el-descriptions-item label="配置名称">{{ props.row.pullConfigName }}</el-descriptions-item>
                <el-descriptions-item label="渠道名称">{{ props.row.channelName }}</el-descriptions-item>
                <el-descriptions-item label="拉取类型">{{ props.row.pullType }}</el-descriptions-item>

                <el-descriptions-item label="渠道号">{{ props.row.channelCode }}</el-descriptions-item>
                <el-descriptions-item label="商户号">{{ props.row.merchantCode }}</el-descriptions-item>
                <el-descriptions-item label="产品号">{{ props.row.prodCode }}</el-descriptions-item>

                <el-descriptions-item label="目标文件后缀">{{ props.row.fileExt }}</el-descriptions-item>
                <el-descriptions-item label="目标文件MD5" :span="2">{{ props.row.targetFileMd5 }}</el-descriptions-item>
                <el-descriptions-item label="目标文件URL" :span="3">{{ props.row.targetFileUrl }}</el-descriptions-item>

                <el-descriptions-item label="剩余次数">{{ props.row.execTimes }}</el-descriptions-item>
                <el-descriptions-item label="重试间隔">{{ props.row.retryGap }}</el-descriptions-item>
                <el-descriptions-item label="机器IP">{{ props.row.operatorIp }}</el-descriptions-item>

                <el-descriptions-item label="是否签章">
                  <el-tag v-if="props.row.signature === 1" type="success" effect="plain">是</el-tag>
                  <el-tag v-else type="danger" effect="plain">否</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="是否回传">
                  <el-tag v-if="props.row.callback === 1" type="success" effect="plain">是</el-tag>
                  <el-tag v-else type="danger" effect="plain">否</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="回传类型">{{ props.row.callbackType }}</el-descriptions-item>

                <el-descriptions-item label="回传压缩包名">{{ props.row.callbackZipFileName }}</el-descriptions-item>
                <el-descriptions-item label="回传协议列表">{{ props.row.callbackProtocolType }}</el-descriptions-item>
                <el-descriptions-item label="回传文件路径">{{ props.row.callbackFilePath }}</el-descriptions-item>
                <el-descriptions-item label="回传文件名称">{{ props.row.callbackFileName }}</el-descriptions-item>
                <el-descriptions-item label="OK文件类型">{{ props.row.okFileType }}</el-descriptions-item>
                <el-descriptions-item label="OK文件名称">{{ props.row.okFileName }}</el-descriptions-item>
                <el-descriptions-item label="实时回传起始时间">{{ props.row.realtimeBeginTime }}</el-descriptions-item>
              </el-descriptions>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="记录ID" align="center" />
          <el-table-column prop="dataId" label="执行日期" align="center" />
          <el-table-column prop="pullDate" label="文件日期" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag effect="plain" type="info" v-if="scope.row.status === 0">0-待拉取</el-tag>
              <el-tag effect="plain" type="warning" v-else-if="scope.row.status === 1">1-待发送</el-tag>
              <el-tag effect="plain" v-else-if="scope.row.status === 2 && scope.row.callback === 1">2-待回传</el-tag>
              <el-tag effect="plain" type="success" v-else-if="scope.row.status === 2">2-已发送</el-tag>
              <el-tag effect="plain" type="danger" v-else-if="scope.row.status === 9">9-执行失败</el-tag>
              <el-tag effect="plain" type="danger" v-else>{{ scope.row.status + '-未知状态' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="lastPullTime" label="最后拉取时间" align="center" />
          <el-table-column prop="lastSendTime" label="最后发送时间" align="center" />
          <el-table-column prop="lastCallbackTime" label="最后回传时间" align="center" />
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
