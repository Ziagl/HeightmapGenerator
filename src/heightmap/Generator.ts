import { GeneratorData } from './GeneratorData'
import { TriangleDivision } from './algorithms/TriangleDivision'
import { DiamondSquare } from './algorithms/DiamondSquare'
import { MidpointDisplacement } from './algorithms/MidpointDisplacement'
import { FaultFormation } from './algorithms/FaultFormation'
import { ParticleDeposition } from './algorithms/ParticleDeposition'
import { PerlinNoise } from './algorithms/PerlinNoise'
import { VoronoiDiagram } from './algorithms/VoronoiDiagram'
import { Algorithm } from './algorithms/Algorithm'

// to add new heightmap methods:
//    * add a new object into algorithms.json
//    * add a new method
//    * add a mapping function name of name from json into _heightmapMethod array
//    * implement IAlgorithm interface for this heightmap method
export class Generator {
    private _data: GeneratorData
    private _heightmapMethod: { [K: string]: Function } = {
        triangledivision: this.triangleDivision,
        diamondsquare: this.diamondSquare,
        midpointdisplacement: this.midpointDisplacement,
        faultformation: this.faultFormation,
        particledeposition: this.particleDeposition,
        perlinnoise: this.perlinNoise,
        voronoidiagram: this.voronoiDiagram,
    }

    constructor(data: GeneratorData) {
        this._data = data
    }

    public generate() {
        // call algorithm function by defined name (see algorithms.json)
        this.heightmapMethod(this._data.getFunctionName(), this._data)
    }

    // this method looks if given function name as string matches
    // an implemented heightmapmethod and calls it
    // otherwise displays error message
    private heightmapMethod(name: string, data: GeneratorData) {
        if (this._heightmapMethod[name]) {
            return this._heightmapMethod[name](data, this.createHeightmapImage)
        }

        console.error(`Method '${name}' is not implemented.`)
    }

    // renders heightmap array as image into canvas
    private createHeightmapImage(heightmap: Uint8ClampedArray, size: number) {
        let canvas = document.getElementById('heightmapCanvas') as HTMLCanvasElement
        canvas.width = size
        canvas.height = size
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        let imageData = new ImageData(heightmap, size, size)
        ctx.putImageData(imageData, 0, 0)
        document.body.appendChild(canvas)
    }

    // this block of code represents all implemented heightmap methods
    private triangleDivision(data: GeneratorData, createHeightmapImage: Function) {
        let algorithm = new TriangleDivision(data.seed, data.size, data.getParams())
        algorithm.generate()
        createHeightmapImage(algorithm.getImageAsColorArray(), data.size)
    }

    private diamondSquare(data: GeneratorData, createHeightmapImage: Function) {
        let algorithm = new DiamondSquare(data.seed, data.size, data.getParams())
        algorithm.generate()
        createHeightmapImage(algorithm.getImageAsColorArray(), data.size)
    }

    private midpointDisplacement(data: GeneratorData, createHeightmapImage: Function) {
        let algorithm = new MidpointDisplacement(data.seed, data.size, data.getParams())
        algorithm.generate()
        createHeightmapImage(algorithm.getImageAsColorArray(), data.size)
    }

    private faultFormation(data: GeneratorData, createHeightmapImage: Function) {
        let algorithm = new FaultFormation(data.seed, data.size, data.getParams())
        algorithm.generate()
        createHeightmapImage(algorithm.getImageAsColorArray(), data.size)
    }

    private particleDeposition(data: GeneratorData, createHeightmapImage: Function) {
        let algorithm = new ParticleDeposition(data.seed, data.size, data.getParams())
        algorithm.generate()
        createHeightmapImage(algorithm.getImageAsColorArray(), data.size)
    }

    private perlinNoise(data: GeneratorData, createHeightmapImage: Function) {
        let algorithm = new PerlinNoise(data.seed, data.size, data.getParams())
        algorithm.generate()
        createHeightmapImage(algorithm.getImageAsColorArray(), data.size)
    }
    private voronoiDiagram(data: GeneratorData, createHeightmapImage: Function) {
        let algorithm = new VoronoiDiagram(data.seed, data.size, data.getParams())
        algorithm.generate()
        createHeightmapImage(algorithm.getImageAsColorArray(), data.size)
    }
}
