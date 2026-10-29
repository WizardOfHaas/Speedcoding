export class Drum{
    data: Array<number>

    constructor(){
        this.data = Array(1024).fill(0)
    }

    read(addr: number, len: number): Array<number>{
        return this.data.slice(addr, addr + len + 1)
    }

    write(addr: number, block: Array<number>){
        this.data.splice(addr, block.length, ...block)
    }
}