import { Vue } from 'vue-property-decorator'
import Index from './v-comp/index.vue'

const components = [
  Index
]

const install: any = function (vue: typeof Vue) {
  if (install.installed) return
  components.map(component => vue.component(component.name, component))
}

// 判断是否是直接引入文件
if (typeof (window as any) !== 'undefined' && (window as any).Vue) {
  install((window as any).Vue)
}

export default {
  install,
  components
}
