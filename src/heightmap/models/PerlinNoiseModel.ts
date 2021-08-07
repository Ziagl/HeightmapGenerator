export class PerlinNoiseModel {
    private _persistence: number
    private _frequency: number
    private _amplitude: number
    private _octaves: number
    private _seed: number

    constructor(
        persistence: number,
        frequency: number,
        amplitude: number,
        octaves: number,
        seed: number
    ) {
        this._persistence = persistence
        this._frequency = frequency
        this._amplitude = amplitude
        this._octaves = octaves
        this._seed = 2 + seed * seed
    }

    public getHeight(x: number, y: number): number {
        return this._amplitude * this.total(x, y)
    }

    private total(x: number, y: number): number {
        let t = 0.0
        let ampl = 1
        let freq = this._frequency

        for (let k = 0; k < this._octaves; ++k) {
            t += this.getValue(x * freq + this._seed, y * freq + this._seed) * ampl
            ampl *= this._persistence
            freq *= 2
        }

        return t
    }

    private getValue(x: number, y: number): number {
        let xInt = Math.floor(x)
        let yInt = Math.floor(y)
        let xFrac = x - xInt
        let yFrac = y - yInt

        let n01 = this.noise(xInt - 1, yInt - 1)
        let n02 = this.noise(xInt + 1, yInt - 1)
        let n03 = this.noise(xInt - 1, yInt + 1)
        let n04 = this.noise(xInt + 1, yInt + 1)
        let n05 = this.noise(xInt - 1, yInt)
        let n06 = this.noise(xInt + 1, yInt)
        let n07 = this.noise(xInt, yInt - 1)
        let n08 = this.noise(xInt, yInt + 1)
        let n09 = this.noise(xInt, yInt)

        let n12 = this.noise(xInt + 2, yInt - 1)
        let n14 = this.noise(xInt + 2, yInt + 1)
        let n16 = this.noise(xInt + 2, yInt)

        let n23 = this.noise(xInt - 1, yInt + 2)
        let n24 = this.noise(xInt + 1, yInt + 2)
        let n28 = this.noise(xInt, yInt + 2)

        let n34 = this.noise(xInt + 2, yInt + 2)

        let x0y0 = 0.0625 * (n01 + n02 + n03 + n04) + 0.125 * (n05 + n06 + n07 + n08) + 0.25 * n09
        let x1y0 = 0.0625 * (n07 + n12 + n08 + n14) + 0.125 * (n09 + n16 + n02 + n04) + 0.25 * n06
        let x0y1 = 0.0625 * (n05 + n06 + n23 + n24) + 0.125 * (n03 + n04 + n09 + n28) + 0.25 * n08
        let x1y1 = 0.0625 * (n09 + n16 + n28 + n34) + 0.125 * (n08 + n14 + n06 + n24) + 0.25 * n04

        let v1 = this.interpolate(x0y0, x1y0, xFrac)
        let v2 = this.interpolate(x0y1, x1y1, xFrac)
        return this.interpolate(v1, v2, yFrac)
    }

    private interpolate(x: number, y: number, a: number): number {
        let negA = 1.0 - a
        let negASqr = negA * negA
        let fac1 = 3.0 * negASqr - 2.0 * (negASqr * negA)
        let aSqr = a * a
        let fac2 = 3.0 * aSqr - 2.0 * (aSqr * a)

        return x * fac1 + y * fac2
    }

    private noise(x: number, y: number): number {
        let n = x + y * 57
        n = (n << 13) ^ n
        let t = (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff
        return 1.0 - t * 0.931322574615478515625e-9
    }

    /*
    public perlin(x: number, y: number): number {
        let x0 = x
        let x1 = x0 + 1
        let y0 = y
        let y1 = y0 + 1

        let sx = x - x0
        let sy = y - y0

        let n0 = this.dotGridGradient(x0, y0, x, y)
        let n1 = this.dotGridGradient(x1, y0, x, y)
        let ix0 = this.interpolate(n0, n1, sx)

        n0 = this.dotGridGradient(x0, y1, x, y)
        n1 = this.dotGridGradient(x1, y1, x, y)
        let ix1 = this.interpolate(n0, n1, sx)

        let value = this.interpolate(ix0, ix1, sy)
        return value
    }

    private randomGradient(ix: number, iy: number): [number, number] {
        let random =
            2920.0 *
            Math.sin(ix * 21942.0 + iy * 171324.0 + 8912.0) *
            Math.cos(ix * 23157.0 + iy * 217832.0 + 9758.0)
        return [Math.cos(random), Math.sin(random)]
    }

    private dotGridGradient(ix: number, iy: number, x: number, y: number): number {
        let gradient = this.randomGradient(ix, iy)

        let dx = x - ix
        let dy = y - iy

        return dx * gradient[0] + dy * gradient[1]
    }

    private interpolate(a0: number, a1: number, w: number): number {
        return (a1 - a0) * w + a0
    }
    */
}
