import { Algorithm } from './interfaces/IAlgorithm'
import { Param } from './interfaces/IParam'

export class GeneratorData {
    public seed: number
    public size: number
    public filename: string
    public algorithms: Algorithm[] = []

    private _paramsId: string // id of params div
    private _selectId: string // id of algorithm option
    private _selectedAlgorithm: number

    constructor(paramsId: string, selectId: string) {
        this.seed = 0
        this.size = 0
        this.filename = ''
        this._paramsId = paramsId
        this._selectId = selectId
        this._selectedAlgorithm = 0

        this.loadFromFile('assets/algorithms.json')
    }

    public loadFromFile(filename: string) {
        let request: XMLHttpRequest = new XMLHttpRequest()
        request.open('GET', filename)
        request.addEventListener('load', this.onFileLoaded.bind(this, filename, request))
        request.send()
    }

    private onFileLoaded(filename: string, request: XMLHttpRequest) {
        if (request.status === 200) {
            this.algorithms = JSON.parse(request.responseText)
            this.updateAlgorithmList()
        } else {
            console.log('Error loading file: ' + filename)
        }
    }

    private updateAlgorithmList() {
        let select = document.getElementById(this._selectId) as HTMLSelectElement

        // update algorithm list select
        for (let i = 0; i < this.algorithms.length; i++) {
            if(this.algorithms[i]['active'] === true) {
                let option = document.createElement('option')
                option.text = this.algorithms[i]['name']
                option.value = i.toString()
                select.add(option)
            }
        }

        this.updateForm(0)
    }

    public updateForm(index: number) {
        let params = document.getElementById(this._paramsId) as HTMLDivElement
        // remove existin params
        params.innerHTML = ''
        // add new params
        this._selectedAlgorithm = index
        let data: Param[] = this.algorithms[this._selectedAlgorithm]['params']
        for (let i = 0; i < data.length; i++) {
            // add div
            let div = document.createElement('div')
            div.className = 'col-auto'
            params.appendChild(div)
            // add label
            let label = document.createElement('label')
            label.className = 'form-label'
            label.htmlFor = data[i]['name']
            label.innerHTML =
                data[i]['name'].charAt(0).toUpperCase() + data[i]['name'].slice(1) + ':'
            div.appendChild(label)
            // add input
            let input = document.createElement('input')
            input.className = 'form-control'
            input.type = 'text'
            input.id = data[i]['name']
            input.name = data[i]['name']
            input.value = data[i]['default'].toString()
            input.defaultValue = data[i]['default'].toString()
            div.appendChild(input)
        }
    }

    public updateData(data: FormData) {
        // update static data
        this.seed = data.get('seed') as unknown as number
        this.size = data.get('size') as unknown as number
        // update dynamic algorithm data
        var params = this.algorithms[this._selectedAlgorithm]['params']
        for(var i = 0; i < params.length; ++i) {
            this.algorithms[this._selectedAlgorithm]['params'][i]['default'] = data.get(params[i]['name']) as unknown as number
        }
    }

    public getFunctionName(): string {
        return this.algorithms[this._selectedAlgorithm]['function']
    }

    public getParams(): Param[] {
        return this.algorithms[this._selectedAlgorithm]['params']
    }
}
