<template lang="pug">
  
  component(v-bind:is='comp2show')

</template>


<script>

import {EventBus} from '../../../main'

import ManParallel from '../parallel/select/ManParallel'
import AllParallel from '../parallel/select/AllParallel'
import FracParallel from '../parallel/select/FracParallel'
import ParetoParallel from '../parallel/select/ParetoParallel'
import ParallelSelection from '../parallel/ParallelSelection.vue'

export default {
  
  components: {
    ManParallel,
    AllParallel,
    FracParallel,
    ParetoParallel,
    ParallelSelection
  },

  data() {
    return {
      comp2show: 'ParallelSelection'
    }
  },

  created() {
    EventBus.$on('typeSelected', selectionType => {
      this.comp2show = selectionType
    })
  }

}
</script>
