import { IHeightmapAlgorithm } from '../interfaces/IHeightmapAlgorithm'
import { Param } from '../interfaces/IParam'
import Rand, { PRNG } from 'rand-seed'

export abstract class Algorithm implements IHeightmapAlgorithm {
    public readonly seed: number
    public readonly size: number
    public readonly params: Param[]
    public heightmap: number[]

    protected rand: Rand
    protected MAXHEIGHT = 255

    constructor(seed: number, size: number, params: Param[]) {
        this.seed = Number(seed)
        this.size = Number(size)
        this.params = params
        this.heightmap = new Array(this.size * this.size).fill(0)
        // init random number generator
        this.rand = new Rand(this.seed.toString())
    }

    abstract generate(): void

    // get a random number in given range
    protected random(min: number, max: number): number {
        return this.rand.next() * (Math.abs(min) + Math.abs(max)) - Math.abs(min)
    }

    // 2D position to 1D array index
    protected computeIndex(x: number, y: number): number {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            console.error('Index out of range.')
            return 0
        }
        return x + y * this.size
    }

    // normalize heightmap values to 0-1
    protected normalize() {
        let minHeight = Number.MAX_VALUE,
            maxHeight = 0
        // find min and max height
        for (let i = 0; i < this.size * this.size; ++i) {
            if (this.heightmap[i] > maxHeight) {
                maxHeight = this.heightmap[i]
            }
            if (this.heightmap[i] < minHeight) {
                minHeight = this.heightmap[i]
            }
        }
        // normalize
        let scale = 1.0 / (maxHeight - minHeight)
        for (let i = 0; i < this.size * this.size; ++i) {
            this.heightmap[i] = (this.heightmap[i] - minHeight) * scale
        }
    }

    protected filterTerrain(firValue: number) {
        // TODO: implement
    }

    // creates an color image array from the heightmap (grey scale)
    public getImageAsColorArray(): Uint8ClampedArray {
        let buffer = new Uint8ClampedArray(this.size * this.size * 4)
        for (let i = 0; i < this.size; ++i) {
            for (let j = 0; j < this.size; ++j) {
                let index = this.computeIndex(i, j)
                let color = this.heightmap[i + j * this.size] * this.MAXHEIGHT
                buffer[index * 4] = color
                buffer[index * 4 + 1] = color
                buffer[index * 4 + 2] = color
                buffer[index * 4 + 3] = this.MAXHEIGHT
            }
        }
        return buffer
    }
}
