import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
	  // 获取当前歌单的数组
    topListIds:[],
	// 获取下一个的id
	nextId:'',
	lastId:''
  },
  mutations: {
    INIT_TOPLISTIDS(state,payload){
		state.topListIds = payload
	},
	NEXT_ID(state,payload){
		// 获取当前id
		state.nextId = payload
		// 遍历歌单中的数组，找到当前id索引后 +1 就能获取到下一首的id
		for (var i = 0; i < state.topListIds.length; i++) {
			if(state.topListIds[i].id == payload){
				state.nextId = state.topListIds[i+1].id
			}
		}
	},
	LAST_ID(state,payload){
		// 遍历歌单中的数组，找到当前id索引后 -1 就能获取到上一首的id
		for (var i = 0; i < state.topListIds.length; i++) {
			if(state.topListIds[i].id == payload){
				state.lastId = state.topListIds[i-1].id
			}
		}
	}
  }
})

export default store