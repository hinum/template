import kaboom from "kaboom"

const WIDTH = 128
const ASPECT_RATIO = (16 / 9)

export const k = kaboom({
  width: WIDTH,
  height: WIDTH * ASPECT_RATIO,
  scale: innerWidth / WIDTH
})
