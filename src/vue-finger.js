/**
 * @Author    graysheep
 * @DateTime  2016-06-03    
 * @private
 */
function getLen(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
}

function cross(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y
}

function getAngle(v1, v2) {
    const mr = getLen(v1) * getLen(v2)
    if (mr === 0) return 0
    var r = dot(v1, v2) / mr
    if (r > 1) r = 1
    return Math.acos(r)
}

function getRotateAngle(v1, v2) {
    var angle = getAngle(v1, v2)
    if (cross(v1, v2) > 0) {
        angle *= -1
    }

    return angle * 180 / Math.PI
}

export default {
  install (Vue) {
    Vue.directive('finger', {
      isFn: true,
      accessStatement: true,

      bind () {
        const el = this.el
        Transform(el)

        this.preV = { x: null, y: null }
        this.pinchStartLen = null
        this.scale = 1
        this.isDoubleTap = false

        this.delta = null
        this.last = null
        this.now = null
        this.tapTimeout = null
        this.touchTimeout = null
        this.longTapTimeout = null
        this.swipeTimeout=null
        this.x1 = this.x2 = this.y1 = this.y2 = null
        this.preTapPosition={x:null,y:null}

        el.addEventListener('touchstart', this.start.bind(this), false)
        el.addEventListener('touchmove', this.move.bind(this), false)
        el.addEventListener('touchend', this.end.bind(this), false)
        el.addEventListener('touchcancel', this.cancel.bind(this),false)
      },

      update (fn) {
        const args = this.arg.split('-')
        if (args.length === 1) {
          this[args] = fn
        } else {
          this[args[0] + args[1][0].toUpperCase() + args[1].slice(1)] = fn
        }
      },

      start (evt) {
        if (!evt.touches) return
        this.now = Date.now()
        this.x1 = evt.touches[0].pageX
        this.y1 = evt.touches[0].pageY
        this.delta = this.now - (this.last || this.now)

        this.tap && this.tap()
        if (this.preTapPosition.x !== null) {
          this.isDoubleTap = (this.delta > 0 && this.delta < 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30)
          this.preTapPosition = {x:null, y:null}
        }
        this.preTapPosition.x = this.x1
        this.preTapPosition.y = this.y1
        this.last = this.now

        if (evt.touches.length > 1) {
          const v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 }
          this.preV.x = v.x
          this.preV.y = v.y
          this.pinchStartLen = getLen(v)
        }

        this.longTapTimeout = setTimeout(() => {
          this.longTap && this.longTap(evt)
        }, 750)
      },

      move (evt) {
        if (!evt.touches) return
        const currentX = evt.touches[0].pageX,
              currentY = evt.touches[0].pageY

        var preV = this.preV
        if (evt.touches.length > 1) {
          const v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY- currentY} 

          if (preV.x !== null) {
            if (this.pinchStartLen > 0) {
              evt.scl = getLen(v) / this.pinchStartLen
              this.pinch && this.pinch(evt)
              this.pinchStartLen = getLen(v)
            }

            evt.angle = getRotateAngle(v, preV)
            this.rotate && this.rotate(evt)
          }

          preV.x = v.x
          preV.y = v.y
        } else {
          if (this.x2 !== null) {
            evt.deltaX = currentX - this.x2
            evt.deltaY = currentY - this.y2
          } else {
            evt.deltaX = 0
            evt.deltaY = 0
          }
          this.pressMove && this.pressMove(evt)
        }

        this._cancelLongTap()
        this.x2 = currentX
        this.y2 = currentY

        if (evt.touches.length > 1) {
          evt.preventDefault()
        }
      },

      end (evt) {
        if (!evt.changedTouches) return
        this._cancelLongTap()
        this.touchEnd && this.touchEnd(evt)

        //swipe
        if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
            (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
          evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2)
          this.swipe && this.swipe(evt)
        } else {
          if (this.isDoubleTap) {
            this.doubleTap && this.doubleTap(evt)
            clearTimeout(this.touchTimeout)
            this.isDoubleTap = false
          } else {
            this.touchTimeout = (() => {
              this.singleTap && this.singleTap(evt)
            }, 250)
          }
        }

        this.preV.x = 0
        this.preV.y = 0
        this.scale = 1
        this.pinchStartLen = null
        this.x1 = this.x2 = this.y1 = this.y2 = null
      },

      cancel (evt) {
        clearTimeout(this.touchTimeout)
        clearTimeout(this.tapTimeout)
        clearTimeout(this.longTapTimeout)
        clearTimeout(this.swipeTimeout)
        this.touchCancel && this.touchCancel(evt)
      },

      _cancelLongTap () {
        clearTimeout(this.longTapTimeout)
      },

      _swipeDirection (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
      }
    })
  }
}