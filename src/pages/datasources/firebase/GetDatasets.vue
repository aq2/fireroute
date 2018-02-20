<template lang="pug">
  
ul
  li(v-for='dataset of datasets' v-bind:key="dataset['.key']")
    p {{dataset.dataset.dataID}}


</template>


<script>

import {datasetsRef} from './../../../firebase'


export default {
  firebase: {
    datasets: datasetsRef
  }

}


</script>
