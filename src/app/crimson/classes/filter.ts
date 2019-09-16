export class Filter {
    private _key: string;
    private _operator: string;
    private _useQuotes: boolean;
    private _value: any;

    get key(){
        return this._key;
    }
    set key(value: string){
        this._key = value;
    }

    get operator(){
        return this._operator;
    }
    set operator(value: any){
        this._operator = value;
    }

    get useQuotes(){
        return this._useQuotes;
    }
    set useQuotes(value: any){
        this._useQuotes = value;
    }

    get value(){
        return this._value;
    }
    set value(value: any){
        this._value = value;
    }
    constructor(key: string, operator: any, value: any, useQuotes?: boolean) {
        this._key = key;
        this._operator = operator;
        this._value = value;
        this._useQuotes = (useQuotes == undefined) ? true : useQuotes;
    }

    public toODataString() {
        if (this.useQuotes) {
            return `${this._key} ${this._operator} '${this.value}'`;
        }

        return `${this._key} ${this._operator} ${this.value}`;
    }

    public toString() {
        return `${this._key}${this._operator}${this.value}`;
    }
}