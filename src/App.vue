<template>
  <div id="app">
    <div><h3>tap</h3><img src="TA.jpg" v-finger:tap="tap"></img></div>
    <div><h3>doubletap</h3><img src="TA.jpg" v-finger:double-tap="doubleTap"></img></div>
    <div><h3>longtap</h3><img src="TA.jpg" v-finger:long-tap="longTap"></img></div>
    <div><h3>pressmove</h3><img src="TA.jpg" v-finger:press-move="pressMove"></img></div>
    <div><h3>pinch</h3><img src="TA.jpg" v-finger:pinch="pinch" alt=""></div>
    <div><h3>rotate</h3><img src="TA.jpg" v-finger:rotate="rotate" alt=""></div>
    <div><h3>swipe</h3><img src="TA.jpg" v-finger:swipe="swipe" alt=""></div>
  </div>
</template>

<script>

function ease(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello Vue!',
      initScale: 1
    }
  },
  methods: {
    tap () {
      console.log('tap')
    },
    doubleTap (evt) {
      const img = evt.target
      new To(img, 'scaleX', 1.5, 500, ease)
      new To(img, 'scaleY', 1.5, 500, ease)
    },
    longTap (evt) {
      const img = evt.target
      new To(img, 'scaleX', 1.5, 500, ease)
      new To(img, 'scaleY', 1.5, 500, ease)
    },
    pressMove (evt) {
      const img = evt.target
      img.translateX += evt.deltaX
      img.translateY += evt.deltaY
      evt.preventDefault()
    },
    pinch (evt) {
      const img = evt.target
      img.scaleX = img.scaleY = img.scaleX ? img.scaleX * evt.scl : this.initScale
      // img.scaleX = img.scaleY = this.initScale * evt.scl
    },
    rotate (evt) {
      const img = evt.target
      img.rotateZ += evt.angle
    },
    swipe (evt) {
      const img = evt.target
      switch (evt.direction) {
        case 'Left':
          new To(img, 'translateX', -50, 500, ease)
          break
        case 'Right':
          new To(img, 'translateX', 50, 500, ease)
          break
        case 'Up':
          new To(img, 'tranlateY', -50, 500, ease)
          break
        case 'Down':
          new To(img, 'tranlateY', 50, 500, ease)
          break
      }
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}

#app {
  text-align: center;
}

img {
  width: 30%;
}
</style>
