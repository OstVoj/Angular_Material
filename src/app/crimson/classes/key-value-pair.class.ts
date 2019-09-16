export class KeyValuePair {

    private _key: string;
    private _value: any;

    get key(){
        return this._key;
    }
    set key(value: string){
        this._key = value;
    }

    get value(){
        return this._value;
    }
    set value(value: any){
        this._value = value;
    }

    constructor(key: string, value: any) {

        this._key = key;
        this._value = value;
        
    }
}