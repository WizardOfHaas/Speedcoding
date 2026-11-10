import { execute, parseAndLoad, mem, getRunning, getIp, setIp, setRunning, unpack, prettyOp, step, tapes, printBuffer, IP, RA, RB, RC, AC, elapsedMillis } from './vm'

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

function displayPrintBuffer(){
    document.getElementById("printer").innerHTML = printBuffer.join("</br>")
}

function displayRegisters(){
    document.getElementById("registers").innerHTML = "IP=" + IP + " Ra=" + RA + " Rb=" + RB + " Rc=" + RC + " AC=" + AC + " Time=" + (elapsedMillis / 1000).toFixed(2) + "s";
}

function loadCodePane(){
    setRunning(false)
    parseAndLoad(document.getElementById("code").value)
    showState()
    document.getElementById('addr-' + getIp()).scrollIntoView()
}

function showState(){
    displayMem()
    displayTape("J")
    displayTape("K")
    displayPrintBuffer()
    displayRegisters()
}

showState()
loadCodePane()

let speedFactor = 1;
(function () {
    const SPEED_STEPS = [1, 5, 10, 50, 100, 500, 1000, /*5000, 10000*/];

    const slider = document.getElementById("speedFactorSlider") as HTMLInputElement;
    const label = document.getElementById("speedFactor") as HTMLSpanElement;

    slider.max = String(SPEED_STEPS.length - 1);
    slider.value = String(SPEED_STEPS.indexOf(1));

    function updateSpeedFactor() {
        speedFactor = SPEED_STEPS[Number(slider.value)];
        label.textContent = String(speedFactor) + "x";
    }

    slider.addEventListener("input", updateSpeedFactor);
    updateSpeedFactor();
})();


document.getElementById("load").onclick = () => {
    loadCodePane()
}

document.getElementById("step").onclick = () => {
    step()
    showState()
}

const MAX_FRAME_DELTA = 100 //ms; clamps the first frame and returns from a backgrounded tab
const FRAME_BUDGET = 12     //ms of real time to spend executing per frame

document.getElementById("run").onclick = () => {
    if ( getRunning() ) {
        return
    }
    setRunning(true)

    let frameCount = 0
    let lastTimestamp = performance.now()
    let simBudget = 0 //Simulated ms owed to the VM; leftover and overshoot carry over between frames

    requestAnimationFrame(function frame(timestamp) {
        try {
            const delta = Math.min(Math.max(timestamp - lastTimestamp, 0), MAX_FRAME_DELTA)
            lastTimestamp = timestamp
            simBudget += delta * speedFactor

            //Run instructions until the simulated time owed is used up
            const wallStart = performance.now()
            while ( getRunning() && simBudget > 0 ) {
                const before = elapsedMillis
                const nextIp = execute(mem[getIp()])
                if ( typeof nextIp === "undefined" ) {
                    console.error("Execute returned invalid next IP, halting")
                    setRunning(false)
                    break
                }
                setIp(nextIp)
                simBudget -= elapsedMillis - before

                //Can't keep up at this speed: drop the backlog rather than letting it grow
                if ( performance.now() - wallStart > FRAME_BUDGET ) {
                    simBudget = 0
                    break
                }
            }

            //Show State every third frame, OR if
            //execution has stopped.
            frameCount++
            if ( frameCount % 3 === 0 || !getRunning() ) {
                showState()
            }

            //Schedule another frame if still running
            if ( getRunning() ) {
                requestAnimationFrame(frame)
            }
        } catch (e) {
            setRunning(false)
            showState()
            throw e
        }
    })
}

document.getElementById("stop").onclick = () => {
    setRunning(false)
}