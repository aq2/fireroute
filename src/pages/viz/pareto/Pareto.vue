<template lang="pug">
  
#pareto
  ParetoCalcs
  ParetoViz(v-if='calcsDone')

</template>


<script>

import {EventBus} from '../../../main'
import ParetoCalcs from '../pareto/ParetoCalcs'
import ParetoViz from '../pareto/ParetoViz'


export default {

components: {
  ParetoCalcs,
  ParetoViz
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
