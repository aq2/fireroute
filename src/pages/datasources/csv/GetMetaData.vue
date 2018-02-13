<template lang='pug'>
  
#page
  h1 category meta-data
  fieldset(class='mainFieldset')
    legend(class='title') please select...
    #exampleTable
      #catNames
        fieldset
          legend category
          .list(v-for='(dimName,i) in dimNames' :id='i') {{dimName}}
      //

      #exampleData
        fieldset
          legend example
          .list(v-for='(score,i) in cands[0]'
            @mouseover='hi(i)' @mouseleave='unhi(i)'
          ) {{score}}
      // 
      
      // load rankables sub-comp, passing in props
      #rankables
        Rankables(:dimNames='dimNames' :alphas='alphas')

      #maxis(v-if='step>0')
        Maxis(:dimNames='dimNames' :crits='crits')

      #ID(v-if='step>1')
        ID(:dimNames='dimNames' :firstAlpha='firstAlpha')
    //

  BuildDaData(:dimMeta='newCatMeta' :candMeta='cands' v-show='step>2')
  //

  // - dynamic components? via events payload
  #instructions
    div(v-show='step == 0')
      p First, <b>select orderable categories to include in rankings</b>
      p ie don't select a non-numeric category
      p need at least two categories
      p press OK when done
      button(@click='checkRankables') OK
    //

    div(v-show='step == 1')
      p now <b>select categories where high values are good</b>
      p the default is lower values are better
      p check the relevant box to over-ride the default
      p press OK when done
      button(@click='checkMaxis') OK
    //

    div(v-show='step == 2')
      p now <b>select a category to use as an identifier</b>
      p this name will be used to identify candidates
      p so it's best to chose an alpha-numeric name
      p press OK when done
      button(@click='gotID') OK
    //

  //

//

</template>
  

<script>

import {EventBus} from '../../../main'
import ID from './ID'
import Maxis from './Maxis'
import Rankables from './Rankables'
import BuildDaData from './../../../builders/BuildDaData'
import TheHeader from './../../../header/TheHeader'

export default {
  data() {
    return {
      step: 0,
      crits: [],
      maxis: [],
      ID: null
    }
  },

  components: {
    Rankables,
    Maxis,
    ID,
    BuildDaData,
    TheHeader
  },
  
  computed: {
    candMeta() {
      return this.$store.getters.getCandMeta
    },
    cands() {
      return this.candMeta.candidates
    },
    dimMeta() {
      return this.$store.getters.getDimMeta
    },     
    alphas() {
      return this.dimMeta.alphas
    },    
    firstAlpha() {
      return this.dimMeta.alphas[0]
    },
    dimNames() {
      return this.dimMeta.dimNames
    },
    newCatMeta() {
      const alphas = this.alphas
      const crits = this.crits
      const dimNames = this.dimNames
      const ID = this.ID
      const maxis = this.maxis
      return {alphas, crits, dimNames, ID, maxis}
    }
  },
  
  methods: {
    checkRankables() {
      // must be at least two crits
      if (this.crits.length > 1) {
        this.step = 1
      } else {
        alert('not enough rankables - need at least one!')
      }      
    },
    checkMaxis() {
        this.step = 2
        const crits = this.crits
        const maxis = this.maxis

        // need to make sure maxi is in rankable
        maxis.forEach(max => {
          if (!crits.includes(max)) {
            alert('maxi not in rank')
            // todo deal with it!
          }
        })
    },
    gotID() {
      this.step = 3
      const dimMeta = this.newCatMeta
      const candMeta = this.candMeta
      this.$store.dispatch('setDimMeta', dimMeta)
      this.$store.dispatch('setCandMeta', candMeta)

      const allDaMeta = {dimMeta, candMeta}
      // send IDgot event, buildDaData listens
      EventBus.$emit('catMetaBuilt', allDaMeta)
    },
    
  },
    
  created() {
    // todo move to main()?
    this.ID = this.alphas[0]

    this.dimNames.forEach((d, i) => {
      if(!this.alphas.includes(i)) {
        this.crits.push(i)}
    })

    // todo fugly - use Sets?
    EventBus.$on('updateCrits', i => {
      if (this.crits.includes(i)) {
        const iIdx = this.crits.indexOf(i)
        this.crits.splice(iIdx, 1)
      } else {
        this.crits.push(i)
      }
    })

    // todo repeated code?
    EventBus.$on('updateMaxis', i => {
      const maxs = this.maxis
      if (maxs.includes(i)) {
        maxs.splice(maxs.indexOf(i), 1)
      } else {
        maxs.push(i)
      }
      this.maxis = maxs
    })

    EventBus.$on('updateID', i => {
      this.ID = i
    })

  }
}

</script>


<style lang="stylus" scoped>

.mainFieldset
  width 400px  // dunno why this works

#exampleTable
  display flex

#exampleTable > div:last-child fieldset
  margin-right 0
  background $g7

#catNames .list
  font-weight bold
  transition 1s all
  // speckly bug ??

#instructions
  margin 1rem 0
  background $g7
  padding 0.5rem 1rem
  width 600px


</style>

<style lang="stylus">

#exampleTable > div:last-child fieldset legend
  background $g8

</style>
