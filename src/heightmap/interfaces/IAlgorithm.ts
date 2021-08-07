import { Param } from './IParam'

export interface Algorithm {
    type: string
    name: string
    active: boolean
    function: string
    params: Param[]
}
