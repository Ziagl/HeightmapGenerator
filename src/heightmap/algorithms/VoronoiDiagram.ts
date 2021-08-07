import { Param } from '../interfaces/IParam'
import { Algorithm } from './Algorithm'

export class VoronoiDiagram extends Algorithm {
    constructor(seed: number, size: number, params: Param[]) {
        super(seed, size, params)
    }

    generate(): void {
        // init params
        let points = 0,
            firValue = 0
        for (let i = 0; i < this.params.length; i++) {
            if (this.params[i].name === 'points') {
                points = Number(this.params[i].default)
            }
            if (this.params[i].name === 'FIR value') {
                firValue = Number(this.params[i].default)
            }
        }
        let voronoiPoints: [number, number][] = []
        // set random points
        for (let i = 0; i < points; ++i) {
            let x = Math.floor(this.random(0, this.size))
            let y = Math.floor(this.random(0, this.size))
            voronoiPoints[i] = [x, y]
        }
        let c1 = 1.0
        let c2 = -1.0
        for (let i = 0; i < this.size; ++i) {
            for (let j = 0; j < this.size; ++j) {
                if (this.heightmap[this.computeIndex(i, j)] === 0.0) {
                    let max = Number.MAX_VALUE
                    let closestPoint = max
                    let secondClosestPoint = max
                    for (let v = 0; v < voronoiPoints.length; ++v) {
                        let distance =
                            Math.abs(i - voronoiPoints[v][0]) + Math.abs(j - voronoiPoints[v][1])
                        if (distance < closestPoint) {
                            secondClosestPoint = closestPoint
                            closestPoint = distance
                        } else {
                            if (distance < secondClosestPoint) {
                                secondClosestPoint = distance
                            }
                        }
                    }
                    let d1 = this.MAXHEIGHT - closestPoint
                    let d2 = this.MAXHEIGHT - secondClosestPoint

                    this.heightmap[this.computeIndex(i, j)] = c1 * d1 + c2 * d2
                }
            }
        }

        if (firValue > 0.0) this.filterTerrain(firValue)
        this.normalize()
    }
}
