interface PageData<T> {
  totalCount: number
  pageSize: number
  totalPage: number
  currPage: number
  records: T[]
}
