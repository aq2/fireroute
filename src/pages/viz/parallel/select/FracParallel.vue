<template lang="pug">
  
#page
  p pick a fraction
  #slider-container


</template>


<script>

import * as d3 from 'd3'

export default {

methods: {
	main() {
		var slider = this.createD3RangeSlider(0, 100) // todo need to set properly
		
		slider.onChange((newRange) => {
			d3.select('#WW').text(newRange.begin)
			d3.select('#EE').text(newRange.end)
		})

		slider.range(0,10) // todo need to set properly
	},

  createD3RangeSlider(rangeMin, rangeMax) {
		var minWidth = 5
		var changeListeners = []
		var container = d3.select('#slider-container')
		var sliderRange = {begin: rangeMin, end: rangeMin}
		var containerHeight = container.node().offsetHeight

		var sliderBox = container.append("div")
															.style("position", "relative")
															.style("height", containerHeight + "px")
															.style("min-width", (minWidth*2) + "px")

		// Create elements in container
		var slider = sliderBox.append("div").attr("class", "slider")
		var handleW = slider.append("div").attr("class", "handle").attr('id', 'WW')
		var handleE = slider.append("div").attr("class", "handle").attr('id', 'EE')

		// Update the `left` and `width` attributes of `slider` based on `sliderRange`
		function updateUIFromRange () {
			var conW = sliderBox.node().clientWidth
			var rangeW = sliderRange.end - sliderRange.begin
			var slope = (conW - minWidth) / (rangeMax - rangeMin)
			var uirangeW = minWidth + rangeW * slope
			var ratio = sliderRange.begin / (rangeMax - rangeMin - rangeW)
			if (isNaN(ratio)) {
				ratio = 0
			}
			var uirangeL = ratio * (conW - uirangeW)

			slider
				.style("left", uirangeL + "px")
				.style("width", uirangeW + "px")
		}

		// Update the `sliderRange` based on the `left` and `width` attributes of `slider`
		function updateRangeFromUI() {
			var uirangeL = parseFloat(slider.style("left"))
			var uirangeW = parseFloat(slider.style("width"))
			var conW = sliderBox.node().clientWidth
			var slope = (conW - minWidth) / (rangeMax - rangeMin)
			var rangeW = (uirangeW - minWidth) / slope
			var uislope = 0
			if (conW != uirangeW) {
				uislope = (rangeMax - rangeMin - rangeW) / (conW - uirangeW)
			}
			var rangeL = rangeMin + uislope * uirangeL
			sliderRange.begin = Math.round(rangeL)
			sliderRange.end = Math.round(rangeL + rangeW)

			// Fire change listeners
			changeListeners.forEach((callback) => {
				callback({begin: sliderRange.begin, end: sliderRange.end})
			})
		}

		// configure drag behavior for handles and slider
		var dragResizeE = d3.drag()
			.on("start", () => {
				d3.event.sourceEvent.stopPropagation()
			})
			.on("drag", () => {
				var dx = d3.event.dx
				if (dx == 0) {
					return
				}
				var conWidth = sliderBox.node().clientWidth
				var newLeft = parseInt(slider.style("left"))
				var newWidth = parseFloat(slider.style("width")) + dx
				newWidth = Math.max(newWidth, minWidth)
				newWidth = Math.min(newWidth, conWidth - newLeft)
				slider.style("width", newWidth + "px")
				updateRangeFromUI()
			})

		var dragResizeW = d3.drag()
			.on("start", function() {
				this.startX = d3.mouse(this)[0]
				d3.event.sourceEvent.stopPropagation()
			})
			.on("drag", function() {
				var dx = d3.mouse(this)[0] - this.startX
				if (dx==0) {
					return
				}
				var newLeft = parseFloat(slider.style("left")) + dx
				var newWidth = parseFloat(slider.style("width")) - dx

				if (newLeft < 0) {
					newWidth += newLeft
					newLeft = 0
				}
				if (newWidth < minWidth) {
					newLeft -= minWidth - newWidth
					newWidth = minWidth
				}

				slider.style("left", newLeft + "px")
				slider.style("width", newWidth + "px")
				updateRangeFromUI()
			})

		var dragMove = d3.drag()
			.on("start", () => {
				d3.event.sourceEvent.stopPropagation()
			})
			.on("drag", () => {
				var dx = d3.event.dx
				var conWidth = sliderBox.node().clientWidth
				var newLeft = parseInt(slider.style("left")) + dx
				var newWidth = parseInt(slider.style("width"))

				newLeft = Math.max(newLeft, 0)
				newLeft = Math.min(newLeft, conWidth - newWidth)
				slider.style("left", newLeft + "px")

				updateRangeFromUI()
			})

		handleE.call(dragResizeE)
		handleW.call(dragResizeW)
		slider.call(dragMove)

		// Click on bar
		sliderBox.on("mousedown", (ev) => {
			var x = d3.mouse(sliderBox.node())[0]
			var props = {}
			var sliderWidth = parseFloat(slider.style("width"))
			var conWidth = sliderBox.node().clientWidth
			props.left = Math.min(conWidth - sliderWidth, Math.max(x - sliderWidth / 2, 0))
			props.left = Math.round(props.left)
			props.width = Math.round(props.width)
			slider.style("left", props.left + "px")
						.style("width", props.width + "px")
			updateRangeFromUI()
		})

		function onChange(callback) {
			changeListeners.push(callback)
			return this
		}

		function setRange(b, e) {
			sliderRange.begin = b
			sliderRange.end = e
			updateUIFromRange()

			// Fire change listeners
			changeListeners.forEach((callback) => {
				callback({begin: sliderRange.begin, end: sliderRange.end})
			})
		}

		function range(b, e) {
			var rLower = Math.min(b, e)
			var rUpper = Math.max(b, e)
			setRange(rLower, rUpper)
			return {begin: sliderRange.begin, end: sliderRange.end}
		}

		setRange(sliderRange.begin, sliderRange.end)

		return {
			range: range,
			onChange: onChange
		}
	},

},

mounted() {
  this.main()
}

}
</script>


<style lang="stylus">

#slider-container
  position relative
  height 30px
  background green
  max-width 800px

.slider 
	position absolute
	border 1px solid #AAB
	background #BCE
	height 100%
	width 58px
	top 0px
	cursor move

.handle
	position absolute
	height 32px
	top -2px
	width 30px
	border 2px solid blue
	background lightblue

#EE
	right -4px
	cursor e-resize

#WW
	cursor w-resize
	left -4px

#WW, #EE
  text-align center


</style>
