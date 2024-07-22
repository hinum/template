import kaboom from "kaplay"

const WIDTH = 128
const ASPECT_RATIO = (16 / 9)

export const k = kaboom({
  width: WIDTH,
  height: WIDTH * (1 / ASPECT_RATIO),
  scale: innerWidth / WIDTH
})
