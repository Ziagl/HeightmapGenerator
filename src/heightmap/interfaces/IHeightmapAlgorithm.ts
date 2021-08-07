import {Param} from "./IParam"

export interface IHeightmapAlgorithm {
    readonly size: number
    readonly seed: number
    readonly params: Param[]
    heightmap: number[]

    generate(): void
}
