//主文件，项目入口
//采用vue+element-ui框架
//根据需要引入相关工具类 方便模块引用

import Vue from 'vue'

//引入elmentUI组件
import ElementUI from 'element-ui'
Vue.use(ElementUI)

import 'element-ui/lib/theme-chalk/index.css'

//引入公共样式
import  './assets/css/common.css'
//引入阿里巴巴字体图标库
import './assets/css/iconfont.css'

import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video

import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodeMirror);

//封装接口
import {ajaxGET, ajaxPUT, ajaxPOST, ajaxDELETE} from '@/common/ajax'
Vue.prototype.ajaxGET = ajaxGET
Vue.prototype.ajaxPUT = ajaxPUT
Vue.prototype.ajaxPOST= ajaxPOST
Vue.prototype.ajaxDELETE = ajaxDELETE


//路由
import router from './router'

import App from './App'

//渲染
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
