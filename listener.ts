import axios from 'axios';

interface IListener {
    send(data:Record<string, unknown>):void;
    toQuery(data:any):string;
    getResult():Record<string, unknown> | undefined;
}
class Listener implements IListener {
    private result?:Record<string, unknown>;
    constructor(private url:string, private method:string) {}
    toQuery(data:any):string {
        var result = '';
        for (let key in data) {
            let value = data[key];
            result += <string>key + '=' + <string>value + '&';
        }
        return result.slice(0, result.length-1);
    }
    send(data:any):void {
        data = this.toQuery(data);
        axios.post(this.url, data).then((res):void => this.result = res.data);
    }
    getResult():Record<string, unknown> | undefined {
        return this.result;
    }
}
export { Listener }