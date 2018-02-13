<template lang="pug">

#fbsrc
  h1 get data from firebase
  // get list of available datasets on firebase

  #yay
    .single-post(v-for='blog in blogs')
      h2 {{blog.author}}
      p {{blog.msg}}
      article key {{blog.id}}

</template>



<script>
export default {
  data() {
    return {
      blogs: []
    }
  },
  created() {
    // get data from dbase
    this.$http.get('https://dvzvue.firebaseio.com/mystuff.json')
      .then(function(data) {
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
        console.log('bA', blogsArray)
        this.blogs = blogsArray
        
      })
  }
}
</script>




<style lang="stylus" scoped>
#fbsrc 
  background #888

#yay 
  // width 1200px
  margin 0 auto
  display flex
  flex-wrap wrap
  background #222
  flex-grow 1
  

.single-post 
  padding 10px
  margin 20px 10px
  box-sizing border-box
  background #eee
  color blue
  border 1px solid green
  flex-basis 300px

</style>


