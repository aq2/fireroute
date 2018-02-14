<template lang="pug">
  
#fbb
  h1 save to firebase!
  #current
    h3 current saved datasets
    ul
      li(v-for='dataset of datasets' v-bind:key="dataset['.key']")
        p {{dataset.dataset.dataID}}

  #save
    label choose an ID for your dataset
    input(type='text' v-model='dataID')
    button(@click='submitDataset()') submit to firebase


</template>

<script>

import { datasetsRef } from './../../../firebase'

export default {
  firebase: {
    datasets: datasetsRef
  },
  
  computed: {
    candiData() {
      return this.$store.getters.getCandiData
    },
    
    candMeta() {
      return this.$store.getters.getCandMeta
    },

    dimData() {
      return this.$store.getters.getDimData
    },
    
    dimMeta() {
      return this.$store.getters.getDimMeta
    },

    allDaData() {
      return {
        adataID:this.dataID,
        candiData:this.candiData, candMeta:this.candMeta,
        dimData:this.dimData, dimMeta:this.dimMeta
      }
    },

    dataID() {
      return this.candMeta.filename.split('.')[0] + '-meta'
    }
  },
  data() {
    return {
      // dataID: 'fish'
    }
  },


  methods: {
    submitDataset() {
      // console.log(this.candMeta)
      datasetsRef.push({dataset: this.allDaData, edit: false})
    }
  }
}



</script>

<style lang="stylus" scoped>

input
  opacity 1
  position relative

label
  position static
  width 400px

#save
  background darkblue
  width 800px
</style>
