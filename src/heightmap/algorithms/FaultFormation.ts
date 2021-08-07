import { InterpolationModes } from 'three'
import { Param } from '../interfaces/IParam'
import { Algorithm } from './Algorithm'

export class FaultFormation extends Algorithm {
    constructor(seed: number, size: number, params: Param[]) {
        super(seed, size, params)
    }

    generate(): void {
        // init params
        let iterations = 0,
            filterIterations = 0,
            firValue = 0
        for (let i = 0; i < this.params.length; i++) {
            if (this.params[i].name === 'iterations') {
                iterations = Number(this.params[i].default)
            }
            if (this.params[i].name === 'filter iterations') {
                filterIterations = Number(this.params[i].default)
            }
            if (this.params[i].name === 'FIR value') {
                firValue = Number(this.params[i].default)
            }
        }
        for (let i = 0; i < iterations; ++i) {
            let heightDifference = 100.0 * (1.0 - i / iterations)
            let x1, x2, y1, y2
            x1 = Math.floor(this.random(0, this.size))
            y1 = Math.floor(this.random(0, this.size))
            do {
                x2 = Math.floor(this.random(0, this.size))
                y2 = Math.floor(this.random(0, this.size))
            } while (x1 === x2 && y1 === y2)
            let dx = x2 - x1
            let dy = y2 - y1
            let upDown = (dx > 0 && dy < 0) || (dx > 0 && dy > 0)
            if (dx) dy /= dx
            else dy = 0.0
            let x = 0
            let y = y1 - x1 * dy
            for (x2 = 0; x2 < this.size; ++x2, y += dy) {
                for (y2 = 0; y2 < this.size; ++y2) {
                    if ((upDown && y2 < y) || (!upDown && y2 > y)) {
                        this.heightmap[x2 + y2 * this.size] += heightDifference
                    }
                }
            }
            if (firValue > 0.0)
                if (i % filterIterations === 0 && filterIterations) this.filterTerrain(firValue)
        }

        this.normalize()
    }
}
