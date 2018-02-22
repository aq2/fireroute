<template lang="pug">

#main  
  TheHeader
  router-view
  //- label Name
  //- input(type='text' v-model='name')
  //- button(@click='submitName()') add name

  //- #out
  //-   ul
  //-     li(v-for='personName of names' v-bind:key="personName['.key']")
  //-       p {{personName.name}}
  //-       button(@click="removeName(personName['.key'])") remove {{personName.name}}


</template>


<script>

import TheHeader from './header/TheHeader'
// import { namesRef } from './firebase'

export default {

components: {
  TheHeader
},
data() {
  return {
    name: ''
  }
},
// firebase: {
//   // names: namesRef
// },


// methods: {
//   submitName() {
//     namesRef.push({ name: this.name, edit: false })
//     this.name = ''
//   },
//   removeName(key) {
//     namesRef.child(key).remove()
//   }
// }
}
</script>


<style lang="stylus" scoped>

input
  opacity 1

</style>


<style lang="stylus">
* 
  box-sizing border-box
  user-select none
  outline none

html
  height 100%
  // background green
  background $g5

body 
  margin 0
  padding 0
  color #121
  height 100%
  background $g5
  font-size 1.15em
  font-family Ubuntu, Helvetica, Arial, sans-serif

#app 
  display flex        // sidebar 'fixed', #main grows
  background $g4
  height 100%

</style>
