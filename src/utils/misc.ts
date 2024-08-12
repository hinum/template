type allowedKey = string | number | symbol
export const entries = <K extends allowedKey,T>(obj: Record<K,T>)=>Object.entries(obj) as [K,T][]
export const fromEntries = <K extends allowedKey,T>(arr: [K,T][])=>Object.entries(arr) as Record<K,T>
export const keys = <K extends allowedKey>(obj: Record<K, unknown>)=>Object.keys(obj) as K[]
export const values = <T>(obj: Record<any, T>)=>Object.values(obj) as T[]

export const promisify = <T>(fn: (handler: (e: T)=>void)=>unknown)=>new Promise<T>(res=>fn(res))
export function print<T>(inp: T){
  console.log(inp)
  return inp
}
