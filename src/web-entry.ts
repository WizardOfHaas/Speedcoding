import { execute, parseAndLoad, mem, getRunning, getIp, setIp, setRunning, unpack, prettyOp, step, tapes } from 'vm'

function displayMem(){
    document.getElementById("mem").innerHTML = mem.map((d, addr) => {
        const op = unpack(d, addr)
        const prettyOPs = (d !== 0 ? prettyOp(op) : "")
        const c = getIp() === addr ? "current-op" : ""
        return "<tr id='addr-" + addr + "' class='" + c + "'><td>" + addr + "</td><td>" + d + "</td><td>" + prettyOPs + "</td></tr>"
    }).join("")
}

function displayTape(tapeName: string){
    document.getElementById("tape-" + tapeName).innerHTML = ""
    tapes[tapeName].getRecords().forEach((r, i) => {
        const c = (i === tapes[tapeName].getHead() ? "current-op" : "")
        document.getElementById("tape-" + tapeName).innerHTML += "<tr class='" + c + "'><td>" + r.join(", ") + "</td></tr>"
    })
}

function loadCodePane(){
    parseAndLoad(document.getElementById("code").value)
}

function showState(){
    displayMem()
    displayTape("J")
    displayTape("K")
}

loadCodePane()
showState()

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

document.getElementById('addr-' + getIp()).scrollIntoView();

document.getElementById("load").onclick = () => {
    loadCodePane()
}

document.getElementById("step").onclick = () => {
    step()
    showState()
}

document.getElementById("run").onclick = async () => {
    setRunning(true)

    while(getRunning()){
        const nextIp = execute(mem[getIp()])
        await sleep(document.getElementById("op-delay").value)

        if(typeof nextIp === "undefined"){
            console.log("HALTING FOR SAFETY")
            setRunning(false)
        }else{
            setIp(nextIp)
        }

        showState()
    }
}

document.getElementById("stop").onclick = () => {
    setRunning(false)
}