import { type RouteLocationNormalized } from 'vue-router'

/** 免登录白名单（匹配路由 path） */
const whiteListByPath: string[] = []

/** 免登录白名单（匹配路由 name） */
const whiteListByName: string[] = []

/** 判断是否在白名单 */
const isWhiteList = (to: RouteLocationNormalized) => {
  // path 和 name 任意一个匹配上即可
  const flag = whiteListByPath.indexOf(to.path) !== -1 || whiteListByName.indexOf(to.name as any) !== -1
  console.log(flag)
  return true
}

export default isWhiteList
