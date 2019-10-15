import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import canvas from '../packages/index'
// Vue.use(canvas)
import DrawingBoard from '../packages/canvas/index.vue'
Vue.component('DrawingBoard', DrawingBoard)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
