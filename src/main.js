import Vue from 'vue'
import {store} from './store'
export const EventBus = new Vue()

// http stuff
import routes from './routes'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
Vue.use(VueRouter)
Vue.use(VueResource)
const router = new VueRouter({ routes })

// firebase
import VueFire from 'vuefire'
Vue.use(VueFire)

// let config = {
//   apiKey: "AIzaSyBNYxHpiJt0U-h9Yb3E4MGXVCUBywtFpck",
//   authDomain: "dvzvue.firebaseapp.com",
//   databaseURL: "https://dvzvue.firebaseio.com",
//   projectId: "dvzvue",
//   storageBucket: "dvzvue.appspot.com",
//   messagingSenderId: "804794548950"
// }
// import Firebase from 'firebase'
// let appp = Firebase.initializeApp(config)
// let db = appp.database()
// let messagesRef = db.ref('massages')

// awesome icons
  // cheaper to import them as you need them
  import 'vue-awesome/icons/bar-chart'
  import 'vue-awesome/icons/line-chart'
  import 'vue-awesome/icons/pie-chart'
  import 'vue-awesome/icons/folder-open'
  import 'vue-awesome/icons/area-chart'
  import 'vue-awesome/icons/window-restore'
  import 'vue-awesome/icons/file-text-o'
  import 'vue-awesome/icons/file-excel-o'
  import 'vue-awesome/icons/home'
  import 'vue-awesome/icons/upload'
  import 'vue-awesome/icons/cloud'
  import 'vue-awesome/icons/tasks'
  import 'vue-awesome/icons/database'
  import 'vue-awesome/icons/chevron-circle-right'
  import 'vue-awesome/icons/chevron-circle-left'
  import 'vue-awesome/icons/bicycle'
  import 'vue-awesome/icons/question-circle'
  import 'vue-awesome/icons/search'
  import 'vue-awesome/icons/check-square-o'
  import 'vue-awesome/icons/arrows-v'
  import 'vue-awesome/icons/percent'
  import 'vue-awesome/icons/users'

  // import 'vue-awesome/icons'  // !! warns bundles all icons = 500kB
  import Icon from 'vue-awesome/components/Icon'
  Vue.component('icon', Icon)
//

import App from './App'

new Vue({
  el: '#app',
  store,
  render: h => h(App),
  router,
})
