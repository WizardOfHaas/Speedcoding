import * as fs from 'fs'
import { execute, parseAndLoad, mem, getRunning, getIp, setIp, setRunning } from 'vm'

const source = fs.readFileSync(process.argv[2], 'utf8')

parseAndLoad(source)

while(getRunning()){
    const nextIp = execute(mem[getIp()])

    if(typeof nextIp === "undefined"){
        console.log("HALTING FOR SAFETY")
        setRunning(false)
    }else{
        setIp(nextIp)
    }
}