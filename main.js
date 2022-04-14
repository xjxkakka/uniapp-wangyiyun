import App from './App'
import store from 'store/index.js'
// #ifndef VUE3
import Vue from 'vue'
// iconfont
import './common/iconfont.css';
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif