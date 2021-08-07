import { Param } from '../interfaces/IParam'
import { Algorithm } from './Algorithm'

export class DiamondSquare extends Algorithm {
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
        let dh = 0,
            rectSize = this.size
        let it = 1.0
        while (rectSize > 0) {
            dh = Math.pow(roughness as number, it)
            // Diamond
            for (let i = 0; i < this.size; i += rectSize) {
                for (let j = 0; j < this.size; j += rectSize) {
                    let x = (i + rectSize) & (this.size - 1)
                    let y = (j + rectSize) & (this.size - 1)
                    let mx = Math.floor(i + rectSize / 2)
                    let my = Math.floor(j + rectSize / 2)
                    this.heightmap[this.computeIndex(mx, my)] =
                        0.25 *
                            (this.heightmap[this.computeIndex(i, j)] +
                                this.heightmap[this.computeIndex(x, j)] +
                                this.heightmap[this.computeIndex(i, y)] +
                                this.heightmap[this.computeIndex(x, y)]) +
                        this.random(-dh, dh)
                }
            }
            // Square
            for (let i = 0; i < this.size; i += rectSize) {
                for (let j = 0; j < this.size; j += rectSize) {
                    let x = (i + rectSize) & (this.size - 1)
                    let y = (j + rectSize) & (this.size - 1)
                    let mx = Math.floor(i + rectSize / 2)
                    let my = Math.floor(j + rectSize / 2)
                    let sx = Math.floor((i - rectSize / 2 + this.size) & (this.size - 1))
                    let sy = Math.floor((j - rectSize / 2 + this.size) & (this.size - 1))
                    this.heightmap[this.computeIndex(mx, j)] =
                        0.25 *
                            (this.heightmap[this.computeIndex(i, j)] +
                                this.heightmap[this.computeIndex(x, j)] +
                                this.heightmap[this.computeIndex(mx, sy)] +
                                this.heightmap[this.computeIndex(mx, my)]) +
                        this.random(-dh, dh)
                    this.heightmap[this.computeIndex(i, my)] =
                        0.25 *
                            (this.heightmap[this.computeIndex(i, j)] +
                                this.heightmap[this.computeIndex(i, y)] +
                                this.heightmap[this.computeIndex(sx, my)] +
                                this.heightmap[this.computeIndex(mx, my)]) +
                        this.random(-dh, dh)
                }
            }
            rectSize >>= 1
            ++it
        }

        if (firValue > 0.0) this.filterTerrain(firValue)
        this.normalize()
    }
}
