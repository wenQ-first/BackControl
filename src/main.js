import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from "nprogress"



import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import '@/assets/css/base.css'
import './plugins/element.js'
import "nprogress/nprogress.css"


/* 全局注册TreeTbale */
Vue.component('tree-table', TreeTable);
Vue.use(VueQuillEditor)

Vue.config.productionTip = false;


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
