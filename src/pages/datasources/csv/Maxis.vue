<template lang="pug">

fieldset(id='max')
  legend maxis
  .list(v-for='(dimName, i) in dimNames'
    @mouseover='hi(i)' 
    @mouseleave='unhi(i)') 
    label(v-if='isRankable(i)')
      input(type='checkbox' :value='i' @click='changeMaxis(i)' v-model='maxis')
      span(class='checkmark')

</template>


<script>
import {EventBus} from '../../../main'

export default {
  data() {
    return {
      maxis: []
    }
  },

  props: {
    dimNames: { type: Array }, 
    crits: {type: Array}
  },

  methods: {
    changeMaxis: (i) => {
      EventBus.$emit('updateMaxis', i)
    },
    isRankable(i) {
      return this.crits.includes(i)
    },
    hi: (i) => {
      document.getElementById(i).style.color = 'white'
    },
    unhi: (i) => {
      document.getElementById(i).style.color = 'black'
    }
  }

}

</script>
