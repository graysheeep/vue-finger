# usage
```
Vue.use(require('vue-finger'))

<template>
  <img src="xxx.png" v-finger:pinch=“pinch"></img>
</template>

<script>
  export default {
    methods: {
      pinch (evt) {
        //do something while pinching the img
        console.log(evt.scl) //log pinch scale
      }
    }
  }
</script>
```

# interface

v-finger:tap --- tap element
v-finger:doubleTap --- double tap element
v-finger:longTap --- long tap element(>750ms)
v-finger:pressMove --- press element and drag
v-finger:pinch --- pinch element
v-finger:rotate --- rotate element
v-finger:swipe --- swipe element


# demo

```
npm install
npm install -g anywhere
anywhere

scan the url with phone
```
