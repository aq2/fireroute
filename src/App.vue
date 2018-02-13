<template lang="pug">

#main  
  TheHeader
  router-view

</template>


<script>

import TheHeader from './header/TheHeader'

export default {

components: {
  TheHeader
},

}
</script>


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
