import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
	  currentUser: null
  },
  getters: {
  },
  mutations: {
	  logOut(state) {
		  state.currentUser = null;
		  router.push({ path: 'signin' })
		}
  },
  actions: {
	  
  },
  modules: {
  }
})
