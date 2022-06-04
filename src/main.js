// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI, { Message } from 'element-ui';
import App from './App.vue';
import 'font-awesome/css/font-awesome.css';
import '../static/theme/chalk/index.css';
import bus from './bus';
import i18n from './i18n/i18n';
import util from './util';
import storage from './storage';
import shortcut from './shortcut';
import webApi from './webApi';


Vue.config.productionTip = false;
Vue.prototype.$bus = bus;
Vue.prototype.$util = util;
Vue.prototype.$storage = storage;
Vue.prototype.$shortcut = shortcut;
Vue.prototype.$webApi = webApi;

Message.success = (function () {
  const tmp = Message.success;
  return function (v) {
    if (typeof v === 'object') {
      v = Object.assign(v, { type: 'success' });
      return Message(v);
    }
    return tmp(v);
  };
}());

Message.error = (function () {
  const tmp = Message.error;
  return function (v) {
    if (typeof v === 'object') {
      v = Object.assign(v, { type: 'error' });
      return Message(v);
    }
    return tmp(v);
  };
}());

Vue.use(ElementUI, { size: 'small' });
Vue.config.productionTip = false;

/* eslint-disable no-new */
const vue = new Vue({
  el: '#app',
  i18n,
  components: { App },
  template: '<App/>',
});
export default vue;
