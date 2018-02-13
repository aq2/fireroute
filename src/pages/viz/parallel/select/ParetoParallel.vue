<template lang="pug">
  
#man
  p pick a front
  ParetoCalcs
  ShowFronts(v-if='calcsDone')


</template>


<script>

import {EventBus} from '../../../../main'
import ParetoCalcs from './../../pareto/ParetoCalcs'
import ShowFronts from './ShowFronts'

export default {
  
components: {
  ParetoCalcs,
  ShowFronts
},

data() {
  return {
    calcsDone: false
  }
},

created() {
  EventBus.$on('calcsDone', () => this.calcsDone = true)
}


}
</script>
