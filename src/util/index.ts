import _ from "lodash";

//recursively compares the specified parameters of two objects, returns true if any difference is detected, casts values to string so types are not counted
export function compareR<T>(old: T, new_: T, params: string[]): boolean {
  const oldObj = JSON.parse(JSON.stringify(old))
  const compare = JSON.parse(JSON.stringify(new_))
  return !!params.find((param: string) => {
    //compare two values
    const instantly: boolean = oldObj[param] && !_.isEqual(oldObj[param], compare[param])
    //recursively find in properties
    const inside = !!Object.entries(oldObj).find((entry: any):any => {
      const [key, val] = entry
      if (Array.isArray(val) && Array.isArray(compare[key])) {
        return !!val.find((inside: any, index: number) => compareR<typeof inside>(inside, compare[key][index], params))
      } else if (typeof val === 'object' && typeof compare[key] === 'object') {
        return compareR<typeof val>(val, compare[key], params)
      }
      return undefined
    })
    return instantly || inside
  })
}