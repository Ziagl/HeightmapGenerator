import { Param } from '../interfaces/IParam'
import { Algorithm } from './Algorithm'
import { PerlinNoiseModel } from '../models/PerlinNoiseModel'

export class PerlinNoise extends Algorithm {
    constructor(seed: number, size: number, params: Param[]) {
        super(seed, size, params)
    }

    generate(): void {
        // init params
        let octaves = 0,
            amplitude = 0,
            frequency = 0,
            persistence = 0,
            firValue = 0
        for (let i = 0; i < this.params.length; i++) {
            if (this.params[i].name === 'octaves') {
                octaves = Number(this.params[i].default)
            }
            if (this.params[i].name === 'amplitude') {
                amplitude = Number(this.params[i].default)
            }
            if (this.params[i].name === 'frequency') {
                frequency = Number(this.params[i].default)
            }
            if (this.params[i].name === 'persistence') {
                persistence = Number(this.params[i].default)
            }
            if (this.params[i].name === 'FIR value') {
                firValue = Number(this.params[i].default)
            }
        }
        let p = new PerlinNoiseModel(persistence, frequency, amplitude, octaves, this.seed)

        for (let i = 0; i < this.size; ++i) {
            for (let j = 0; j < this.size; ++j) {
                this.heightmap[this.computeIndex(i, j)] = p.getHeight(i, j)
            }
        }

        if (firValue > 0.0) this.filterTerrain(firValue)
        this.normalize()
    }
}
