import { Param } from '../interfaces/IParam'
import { Algorithm } from './Algorithm'

export class ParticleDeposition extends Algorithm {
    constructor(seed: number, size: number, params: Param[]) {
        super(seed, size, params)
    }

    generate(): void {
        // init params
        let mountains = 0,
            moveDropPosition = 0,
            particles = 0,
            calderaHeight = 0,
            firValue = 0
        for (let i = 0; i < this.params.length; i++) {
            if (this.params[i].name === 'mountains') {
                mountains = Number(this.params[i].default)
            }
            if (this.params[i].name === 'move drop position') {
                moveDropPosition = Number(this.params[i].default)
            }
            if (this.params[i].name === 'particles') {
                particles = Number(this.params[i].default)
            }
            if (this.params[i].name === 'caldera height') {
                calderaHeight = Number(this.params[i].default)
            }
            if (this.params[i].name === 'FIR value') {
                firValue = Number(this.params[i].default)
            }
        }
        const dx = [0, 1, 0, this.size - 1, 1, 1, this.size - 1, this.size - 1]
        const dy = [1, 0, this.size - 1, 0, this.size - 1, 1, this.size - 1, 1]
        for (let m = 0; m < mountains; ++m) {
            let x = Math.floor(this.random(0, this.size))
            let y = Math.floor(this.random(0, this.size))
            let topX = x,
                topY = y
            for (let i = 0; i < particles; ++i) {
                // move particle start point
                if (moveDropPosition && i % moveDropPosition === 0) {
                    let dir = Math.floor(this.random(0, dx.length))
                    x = (x + dx[dir]) & (this.size - 1)
                    y = (y + dy[dir]) & (this.size - 1)
                }
                this.heightmap[this.computeIndex(x, y)]++
                let px = x
                let py = y
                let ok = 0
                while (!ok++) {
                    //let dir = this.random(0, 1)
                    for (let j = 0; j < 8; ++j) {
                        let ofs = (j + m) & 7
                        let tx = (px + dx[ofs]) & (this.size - 1)
                        let ty = (py + dy[ofs]) & (this.size - 1)
                        // move particle if neighbour is lower
                        if (
                            this.heightmap[this.computeIndex(px, py)] >
                            this.heightmap[this.computeIndex(tx, ty)] + 1.0
                        ) {
                            this.heightmap[this.computeIndex(px, py)]--
                            this.heightmap[this.computeIndex(tx, ty)]++
                            // new particle position
                            px = tx
                            py = ty
                            ok = 0
                            break
                        }
                    }
                }
                // save summit
                if (
                    this.heightmap[this.computeIndex(px, py)] >
                    this.heightmap[this.computeIndex(topX, topY)]
                ) {
                    topX = px
                    topY = py
                }
            }
            // invert all points around summmit that are highter than caldera height
            let calderaLine = this.heightmap[this.computeIndex(topX, topY)] - calderaHeight
            if (calderaLine > 0) this.createCalderas(topX, topY, calderaLine)
        }

        if (firValue > 0.0) this.filterTerrain(firValue)
        this.normalize()
    }

    private createCalderas(x: number, y: number, height: number): void {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) return
        if (this.heightmap[this.computeIndex(x, y)] > height) {
            this.heightmap[this.computeIndex(x, y)] -=
                (this.heightmap[this.computeIndex(x, y)] - height) * 2.0

            this.createCalderas(x + 1, y, height)
            this.createCalderas(x - 1, y, height)
            this.createCalderas(x, y + 1, height)
            this.createCalderas(x, y - 1, height)
        }
    }
}
