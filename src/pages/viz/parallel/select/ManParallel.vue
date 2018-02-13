<template lang="pug">
  
#page
  h1 Manual Candidate Selection
  InitializeCands


</template>


<script>

import InitializeCands from './InitializeCands'

export default {
  components: {
    InitializeCands
  },
  computed: {
    candiData() {
      return this.$store.getters.getCandiData
    }
  },

  methods: {
    
  },

  mounted() {
    // this.main()
  }
}
</script>

