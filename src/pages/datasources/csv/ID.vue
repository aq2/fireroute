<template lang="pug">

fieldset(id='idd')
  legend ID
  .list(v-for='(d, i) in dimNames'
    @mouseover='hi(i)' @mouseleave='unhi(i)'
  ) 
    label
      input(type='radio' :value='i' @click='changeID(i)' v-model='IDhere')
      span(class='checkmark radio')
    
</template>


<script>
import {EventBus} from '../../../main'

export default {
  data() {
    return {
      IDhere: null
    }
  },

  props: {
    dimNames: {type: Array},
    firstAlpha: {type: Number}
  },
  
  methods: {
    changeID: (i) => {
      EventBus.$emit('updateID', i)
    },
    hi: (i) => {
      document.getElementById(i).style.color = 'white'
    },
    unhi: (i) => {
      document.getElementById(i).style.color = 'black'
    }
  },

  created() {
    this.IDhere = this.firstAlpha
  }

}

</script>


