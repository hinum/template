import { Color, ColorComp, OpacityComp, PosComp,Vec2 } from "kaplay";
import { k } from "../main";

type DynamicState = {
  value: number
  Dvalue: number
  target: number
}
type DynamicConst = {
  c1: number
  c2: number
}

export const calculateConst = (damp: number, speed: number): DynamicConst=>({
  c1 : damp / (Math.PI * speed),
  c2 : 1 / (2 * Math.PI * speed) ** 2
})

function updateDynamics(state: DynamicState, constants: DynamicConst): DynamicState{
  const { value, Dvalue, target } = state
  const { c1, c2 } = constants

  const dt = k.dt()
  const k2 = Math.max( c2, dt*dt/2 + dt*c1/2, dt*c1)

  return {
    value: value + dt * (Dvalue),
    Dvalue: Dvalue + dt * ( target - value - c1 * Dvalue ) / k2,
    target
  }
}

export type SmoothPos = PosComp & {
  target: Vec2
  state: {
    x: DynamicState
    y: DynamicState
  }
  constants: DynamicConst
  teleportTo(x: number, y: number):void
  smoothTo(x: number, y: number):void
  smoothBy(x: number, y: number):void

  teleportToV(vec2: Vec2): void
  smoothToV(vec2: Vec2): void
  smoothByV(vec2: Vec2): void
}

export const smoothPos = (x:number, y:number, damp: number, speed: number): SmoothPos=>({
  id: "smoothMove",

  constants: calculateConst(damp, speed),
  state: {
    x: {
      value: x,
      Dvalue: 0,
      target: x
    },
    y: {
      value: y,
      Dvalue: 0,
      target: y
    }
  },

  update(){ 
    this.state.x.value = this.pos.x
    this.state.y.value = this.pos.y
    this.state.x = updateDynamics(this.state.x, this.constants)
    this.state.y = updateDynamics(this.state.y, this.constants)
    this.moveTo(this.state.x.value, this.state.y.value)
  },

  set target(vec: Vec2){
    this.state.x.target = vec.x
    this.state.y.target = vec.y
  },
  get target(){
    return k.vec2(this.state.x.target, this.state.y.target)
  },

  teleportTo(x:number, y: number) {
    this.teleportToV(k.vec2(x,y))
  },
  smoothTo(x: number, y: number) {
    this.smoothToV(k.vec2(x,y))
  },
  smoothBy(x: number, y: number) {
    this.smoothByV(k.vec2(x,y))
  },
  smoothByV(vec: Vec2) {
    this.target = this.target.add(vec)
  },
  smoothToV(vec: Vec2) {
    this.target = vec
  },
  teleportToV(vec: Vec2) {
    this.target = vec
    this.moveTo(vec)
  },

  ...k.pos(x,y)
})

export type SmoothOpacity = OpacityComp & {
  target: number
  state: DynamicState
  constants: DynamicConst
  setTo(opacity: number):void
  fadeTo(opacity: number):void
}

export const smoothOpacity = (opacity: number, damp: number, speed: number): SmoothOpacity=>({
  id: "smoothMove",

  constants: calculateConst(damp, speed),
  state: {
    value: opacity,
    target: opacity,
    Dvalue: 0
  },
  update(){ 
    this.state.value = this.opacity
    this.state = updateDynamics(this.state, this.constants)
    this.opacity = this.state.value
  },

  set target(opacity: number){
    this.state.target = opacity
  },
  get target(){
    return this.state.target
  },

  setTo(opacity) {
    this.state.value = opacity
    this.state.target = opacity
  },
  fadeTo(opacity) {
    this.state.target = opacity
  },
  ...k.opacity(opacity)
})

export type SmoothColor = ColorComp & {
  target: Color
  state: {
    r: DynamicState
    g: DynamicState
    b: DynamicState
  }
  constants: DynamicConst
  setTo(r: number, g: number, b: number):void
  changeTo(r: number, g: number, b: number):void
  changeBy(r: number, g: number, b: number):void

  setToC(color: Color): void
  changeToC(color: Color): void
  changeByC(color: Color): void
}

export const smoothColor = (r:number, g:number, b: number, damp: number, speed: number): SmoothColor=>({
  id: "smoothMove",

  constants: calculateConst(damp, speed),
  state: {
    r: {
      value: r,
      Dvalue: 0,
      target: r
    },
    g: {
      value: g,
      Dvalue: 0,
      target: g
    },
    b: {
      value: b,
      Dvalue: 0,
      target: b
    }
  },

  update(){ 
    this.state.r.value = this.color.r
    this.state.g.value = this.color.g
    this.state.b.value = this.color.b
    this.state.r = updateDynamics(this.state.r, this.constants)
    this.state.g = updateDynamics(this.state.g, this.constants)
    this.state.b = updateDynamics(this.state.b, this.constants)
    this.color.r = this.state.r.value
    this.color.g = this.state.g.value
    this.color.b = this.state.b.value
  },

  set target(color){
    this.state.r.target = color.r
    this.state.g.target = color.g
    this.state.b.target = color.b
  },
  get target(){
    return k.rgb(
      this.state.r.target,
      this.state.g.target,
      this.state.b.target,
    )
  },

  setTo(r,g,b) {
    this.target = k.rgb(r,g,b)
  },
  changeTo(r,g,b) {
    this.state.r.target = r
    this.state.g.target = g
    this.state.b.target = b
  },
  changeBy(r,g,b) {
    this.state.r.target = r + this.state.r.target
    this.state.g.target = g + this.state.g.target
    this.state.b.target = b + this.state.b.target
  },
  setToC(color) {
    this.target = color
  },
  changeToC(color) {
    this.changeTo(color.r, color.g, color.b)
  },
  changeByC(color) {
    this.changeBy(color.r, color.g, color.b)
  },

  ...k.color(r,g,b)
})
