var exampleCand = {
  key: 0,
  ID: 'Cambridge',
  scores: [
    {
      catNum: 0,                // repeated data, but useful?
      catName: 'rank',          // repeated data, but useful?
      origScore: 1,
      normalisedScore: false,   // not rankable     * laters?
      rank: false,              // not rankable,    *
      maxi: false               // could be useful  *
    },
    {
      catNum: 1,
      catName: 'name',
      origScore: 'Cambridge',
      normalisedScore: false,
      rank: false
    },
    {
      catNum: 2,
      catName: 'nss',
      origScore: 4732,
      normalisedScore: 0.2,
      rank: 1
    },
    {
      catNum: 3,
      catName: 'hons',
      origScore: 72.1,
      normalisedScore: 0.2,
      rank: 2
    }
  ]
  // later add pareto object {}
}



var values = [
  {index:0, value:3},
  {index:1, value:7},
  {index:2, value:2},
  {index:3, value:7}
]

values.sort(function(a,b) {return a.value - b.value})




 firePost() {
      this.$http.post('https://dvzvue.firebaseio.com/mystuff.json', {
        msg: 'success!',
        author: 'mickey'
      }).then(function(data){
        console.log(data)
        this.submitted = true
      })
    }

created() {
  // get data from dbase
  this.$http.get('https://dvzvue.firebaseio.com/mystuff.json')
    .then(function(data) {
      // console
      return data.json()
    })
    .then(function(data) {
      console.log(data)
      var blogsArray = []
      for (let key in data) {
        console.log(key, data[key])
        data[key].id = key
        blogsArray.push(data[key])
      }
      console.log(blogsArray)
      this.blogs = blogsArray
      
    })
}



//- #sidebar-toggle(@click='toggleSidebar') 
.tooltip 
icon(v-if='sidebarOpen' name='chevron-circle-left' scale=2)
icon(v-else name='chevron-circle-right' scale=2)
span(class='tooltiptext tooltip-right') click to toggle sidebar





<template lang="pug">

a
  v-bind:href="href"
  v-bind:class="{ active: isActive }"
  v-on:click="go"
  
  slot

</template>


<script>

import routes from './../routes'

export default {
  
props: {
  href: {
    type:String,
    required: true 
  }
},

computed: {
  isActive () {
    return this.href === this.$root.currentRoute
  }
},

methods: {
  go (event) {
    event.preventDefault()
    this.$root.currentRoute = this.href
    window.history.pushState(
      null,
      routes[this.href],
      this.href
    )
  }
}

}
</script>

<style lang="stylus" scoped>

.active 
  color cornflowerblue

</style>
