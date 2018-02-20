<template lang="pug">

#page
  h1 get data from firebase
  // get list of available datasets on firebase
  #current
    h3 currently saved datasets
    p(v-if='datasets.length==0') none!
    ul(v-else)
      button(v-for='(dataset, i) of datasets' v-bind:key="dataset['.key']"
             v-bind:idx='i'  @click="loadDataset(dataset['.key'])") 
        | {{dataset.dataset.adataID}} &nbsp; : &nbsp; {{dataset.dataset.desc}}
        span(v-if="dataset.dataset.desc==''") -- no description --
      //- .v
  

</template>



<script>

import { datasetsRef } from '../../../firebase'


export default {
  firebase: {
    datasets: datasetsRef
  },
  data() {
    return {
      // blogs: [],
      dataset: {},
      // idx: -1
    }
  },
  created() {
    // get data from dbase
    this.$http.get('https://dvzvue.firebaseio.com/mystuff.json')
      .then(function(data) {
        return data.json()
      })
      .then(function(data) {
        console.log(data)
        var blogsArray = []
        for (let key in data) {
          console.log(key, data[key])
          data[key].id = key
          blogsArray.push(data[key])
        }
        console.log('bA', blogsArray)
        this.blogs = blogsArray
        
      })
  },
  methods: {
    loadDataset(idx) {
      alert(idx)
      this.dataset = datasetsRef.child(idx)
      // console.log(dataset)
    }
  }
}
</script>




<style lang="stylus" scoped>
#fbsrc 
  background #888

#page
  // margin 0.25rem
  padding 0.5rem

#yay 
  // width 1200px
  margin 0 auto
  display flex
  flex-wrap wrap
  background #222
  flex-grow 1
  
button
  display block
  margin-bottom 1rem

.single-post 
  padding 10px
  margin 20px 10px
  box-sizing border-box
  background #eee
  color blue
  border 1px solid green
  flex-basis 300px

</style>


