import { execute, parseAndLoad, mem, getRunning, getIp, setIp, setRunning, unpack, prettyOp, step } from 'vm'

function displayMem(){
    document.getElementById("mem").innerHTML = mem.map((d, addr) => {
        const op = unpack(d, addr)
        const prettyOPs = (d !== 0 ? prettyOp(op) : "")
        const c = getIp() === addr ? "current-op" : ""
        return "<tr id='addr-" + addr + "' class='" + c + "'><td>" + addr + "</td><td>" + d + "</td><td>" + prettyOPs + "</td></tr>"
    }).join("")
}

function loadCodePane(){
    parseAndLoad(document.getElementById("code").value)
}

function showState(){
    displayMem()
}

loadCodePane()
showState()

document.getElementById('addr-' + getIp()).scrollIntoView();
document.getElementById("step").onclick = () => {
    step()
    showState()
}

setRunning(true)

/*
while(getRunning()){
    const nextIp = execute(mem[getIp()])

    if(typeof nextIp === "undefined"){
        console.log("HALTING FOR SAFETY")
        setRunning(false)
    }else{
        setIp(nextIp)
    }
}
*/