export class Tape{
    records: Array<Array<number>>
    currRecord: number

    constructor(){
        this.records = [[0]] //Placeholder
        this.currRecord = 0
    }

    getRecords(){
        return this.records
    }

    getHead(){
        return this.currRecord
    }

    /**
     * Write
     * Read
     * Skip F
     * Skip B
     * Rewind
     * End file
     */

    write(record: Array<number>){
        this.records[this.currRecord] = record
        this.currRecord++
    }

    read(): Array<number>{
        const record = this.records[this.currRecord]
        this.currRecord++
        return record
    }

    skipForward(){
        this.currRecord++
    }

    skipBackwards(){
        this.currRecord-- //NO PROTECTION
    }

    rewind(){
        this.currRecord = 0
    }

    clearRecords(){
        this.records = []
    }
}