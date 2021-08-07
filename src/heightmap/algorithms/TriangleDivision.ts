import { Param } from '../interfaces/IParam'
import { Algorithm } from './Algorithm'

export class TriangleDivision extends Algorithm {
    constructor(seed: number, size: number, params: Param[]) {
        super(seed, size, params)
    }

    generate(): void {
        // init params
        let roughness = 0,
            firValue = 0
        for (let i = 0; i < this.params.length; i++) {
            if (this.params[i].name === 'roughness') {
                roughness = Number(this.params[i].default)
            }
            if (this.params[i].name === 'FIR value') {
                firValue = Number(this.params[i].default)
            }
        }
        // init variables
        let rectSize = this.size
        let dh = this.size * 0.5
        // random numbers for the edge points
        this.heightmap[this.computeIndex(0, 0)] = this.random(-dh, dh)
        this.heightmap[this.computeIndex(this.size - 1, 0)] = this.random(-dh, dh)
        this.heightmap[this.computeIndex(0, this.size - 1)] = this.random(-dh, dh)
        this.heightmap[this.computeIndex(this.size - 1, this.size - 1)] = this.random(-dh, dh)
        while (rectSize > 0) {
            dh = Math.pow(rectSize, roughness as number)
            for (let i = 0; i < this.size; i += rectSize) {
                for (let j = 0; j < this.size; j += rectSize) {
                    let x = (i + rectSize) & (this.size - 1)
                    let y = (j + rectSize) & (this.size - 1)
                    let mx = Math.floor(i + rectSize / 2)
                    let my = Math.floor(j + rectSize / 2)
                    this.heightmap[this.computeIndex(mx, my)] =
                        0.5 *
                            (this.heightmap[this.computeIndex(x, j)] +
                                this.heightmap[this.computeIndex(i, y)]) +
                        this.random(-dh, dh)
                    this.heightmap[this.computeIndex(mx, j)] =
                        0.5 *
                            (this.heightmap[this.computeIndex(i, j)] +
                                this.heightmap[this.computeIndex(x, j)]) +
                        this.random(-dh, dh)
                    this.heightmap[this.computeIndex(i, my)] =
                        0.5 *
                            (this.heightmap[this.computeIndex(i, j)] +
                                this.heightmap[this.computeIndex(i, y)]) +
                        this.random(-dh, dh)
                }
            }
            rectSize >>= 1
        }

        if (firValue > 0.0) this.filterTerrain(firValue)
        this.normalize()
    }
}
