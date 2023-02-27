import {TGameFilter} from "./types.js";

export function isGameFilter(filter: TGameFilter | any): filter is TGameFilter {
  const cast_ = filter as TGameFilter
  return !!(cast_.teams || cast_.skip || cast_.limit || cast_.date || cast_.league || cast_.conference || cast_.division || cast_.status)
}