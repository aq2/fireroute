import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({

// actual contents of the store 
state: {
  dimMeta: {},
  dimData: {},
  candMeta: [],
  candiData: [],
  // selectedCands: [],
  selectedData: []
},

// components get stored data through these 
getters: {
  getDimData(state) {
    return state.dimData
  },
  getCandiData(state) {
    return state.candiData
  },
  getDimMeta(state) {
    return state.dimMeta
  },
  getCandMeta(state) {
    return state.candMeta
  },
  // getSelectedCands(state) {
  //   return state.selectedCands
  // },
  getSelectedData(state) {
    return state.selectedData
  }
},

// don't call directly!
// call the actions below - get logged then
mutations: {
  mutateCandiData(state, payload) {
    state.candiData = payload
  },
  mutateDimData(state, payload) {
    state.dimData = payload
  },
  mutateCandMeta(state, payload) {
    state.candMeta = payload
  },
  mutateDimMeta(state, payload) {
    state.dimMeta = payload
  },
  // mutateSelectedCands(state, payload) {
  //   state.selectedCands = payload
  // },
  mutateSelectedData(state, payload) {
    state.selectedData = payload
  }
},

// actions (that call mutations) dispatched by component events
// eg. this.$store.dispatch(actionName, payload)
actions: {
  setCandiData(context, payload) {
    context.commit('mutateCandiData', payload)
  },
  setDimData(context, payload) {
    context.commit('mutateDimData', payload)
  },
  setCandMeta(context, payload) {
    context.commit('mutateCandMeta', payload)
  },
  setDimMeta(context, payload) {
    context.commit('mutateDimMeta', payload)
  },
  // setSelectedCands(context, payload) {
  //   context.commit('mutateSelectedCands', payload)
  // },
  setSelectedData(context, payload) {
    context.commit('mutateSelectedData', payload)
  }
}

})