<template lang="pug">
  
#page
  h1 save dataset to firebase
  #current
    h3 currently saved datasets
    p(v-if='datasets.length==0') none!
    ul(v-else)
      li(v-for='dataset of datasets' v-bind:key="dataset['.key']")
        p {{dataset.dataset.adataID}} &nbsp; : &nbsp; {{dataset.dataset.desc}}
          span(v-if="dataset.dataset.desc==''") -- no description --
  #save
    label choose a unique ID for your saved dataset
    input(type='text' v-model='dataID')
    p 
    label you can also add a brief description for the dataset
    textarea(rows=4 cols=50 v-model='desc')
    p 
    button(@click='submitDataset()') submit to firebase

    

</template>

<script>

import { datasetsRef } from './../../../firebase'
// import GetDatasets from './GetDatasets'


export default {
  firebase: {
    datasets: datasetsRef
  },
  components: {
    // GetDatasets
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

    date() {
      const d = new Date()
      const month = d.getMonth()
      const day = d.getDay()
      const date = d.getDate()
      const hour = d.getHours()
      let min = d.getMinutes()
      if (min < 10) {
        min = '0' + min
      }

      const days=['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      return days[day] + months[month] + date + '-' + hour + ':' + min
    },

    allDaData() {
      return {
        adataID:this.dataID, desc:this.desc, 
        candiData:this.candiData, candMeta:this.candMeta,
        dimData:this.dimData, dimMeta:this.dimMeta
      }
    },

    dataID() {
      const datID = this.candMeta.filename.split('.')[0] + '-' + this.date
      // need to return a unique ID!
      return datID
    }
  },
  data() {
    return {
      desc: ''  
    }
  },


  methods: {
    submitDataset() {
      datasetsRef.push({dataset: this.allDaData, edit: false})
    },
  }    
    
}



</script>

<style lang="stylus" scoped>

input
  opacity 1
  position static
  width 250px
  // display block

label
  // position static
  width 600px
  margin 0
  display block
  

#save
  background $g7
  width 800px
  padding 0.5rem
</style>
