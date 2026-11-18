import * as fs from 'fs'
import { execute, parseAndLoad, mem, getRunning, getIp, setIp, setRunning, printBuffer } from 'vm'

const source = fs.readFileSync(process.argv[2], 'utf8')

parseAndLoad(source)

setRunning(true);

while(getRunning()){
    const nextIp = execute(mem[getIp()])
    printBuffer.forEach( s => process.stdout.write(s + '\n') )
    printBuffer.length = 0
    if(typeof nextIp === "undefined"){
        console.log("HALTING FOR SAFETY")
        setRunning(false)
    }else{
        setIp(nextIp)
    }
}