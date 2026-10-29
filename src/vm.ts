import { Tape } from 'tape';

type TExpression = {
    LOC: number,
    sign: boolean,
    R: number,
    OP1: number,
    OP2: number,
    D: number,
    A: number,
    B: number,
    L: number,
    C: number
}

type TOperation = {
    identifier: string,
    code: number,
    //This may need to return an address for next execution...
    //  Or I could just do the global state thing
    execute: (exp: TExpression) => number,
    timing?: (exp: TExpression) => number //In seconds
}

export let mem = Array(1024).fill(0)
export let RA = 0;
export let RB = 0;
export let RC = 0;
export let IP = 0;
export let AC = 0;
export let running = true

export function getIp(){
    return IP
}

export function setIp(n){
    IP = n
}

export function getRunning(){
    return running
}

export function setRunning(b){
    running = b
}

/**
 * My fake tapes: J, K, L, M
 * These are initialized with the %TAPE X directive
 * Where X is the tape drive to load
 */
export let tapes = {
    "J": new Tape(),
    "K": new Tape()
}

/**
 * Print goes here, to be picked up later
 */
export let printBuffer: Array<string> = []

const OP1s: Record<number, TOperation> = {
    /**
     * Math Operations
     */

    658: {
        identifier: "ADD",
        code: 658,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] + mem[Q(exp, "B")]
            return exp.LOC + 1
        },
        timing: (exp) => 4.2
    },

    696: {
        identifier: "SUB",
        code: 696,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] - mem[Q(exp, "B")]
            return exp.LOC + 1
        },
        timing: (exp) => 4.368
    },

    699: {
        identifier: "ADDAB",
        code: 699,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] + Math.abs(mem[Q(exp, "B")])
            return exp.LOC + 1
        },
        timing: (exp) => 4.428
    },

    703: {
        identifier: "ABADD",
        code: 703,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.abs(mem[Q(exp, "A")]) + Math.abs(mem[Q(exp, "B")])
            return exp.LOC + 1
        },
        timing: (exp) => 4.656
    },

    707: {
        identifier: "SUBAB",
        code: 707,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] - Math.abs(mem[Q(exp, "B")])
            return exp.LOC + 1
        },
        timing: (exp) => 4.428
    },

    
    711: {
        identifier: "ABSUB",
        code: 711,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.abs(mem[Q(exp, "A")]) - Math.abs(mem[Q(exp, "B")])
            return exp.LOC + 1
        },
        timing: (exp) => 4.656
    },

    715: {
        identifier: "MPY",
        code: 715,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] * mem[Q(exp, "B")]
            return exp.LOC + 1
        },
        timing: (exp) => 3.546
    },

    731: {
        identifier: "NGMPY",
        code: 731,
        execute: (exp) => {
            mem[Q(exp, "C")] = -1 * mem[Q(exp, "A")] * mem[Q(exp, "B")]
            return exp.LOC + 1
        },
        timing: (exp) => 3.714
    },

    734: {
        identifier: "DIV",
        code: 734,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] / mem[Q(exp, "B")]
            return exp.LOC + 1
        },
        timing: (exp) => 3.666
    },
    
    748: {
        identifier: "NGDIV",
        code: 748,
        execute: (exp) => {
            mem[Q(exp, "C")] = -1 * mem[Q(exp, "A")] / mem[Q(exp, "B")]
            return exp.LOC + 1
        },
        timing: (exp) => 3.834
    },

    782: {
        identifier: "SQRT",
        code: 782,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.sqrt(mem[Q(exp, "A")])
            return exp.LOC + 1
        },
        timing: (exp) => 8.9
    },

    780: {
        identifier: "SINE",
        code: 780,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.sin(mem[Q(exp, "A")])
            return exp.LOC + 1
        },
        timing: (exp) => 13
    },

    781: {
        identifier: "ARTAN",
        code: 781,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.atan(mem[Q(exp, "A")])
            return exp.LOC + 1
        },
        timing: (exp) => 13
    },

    783: {
        identifier: "EXP",
        code: 783,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.E ** mem[Q(exp, "A")]
            return exp.LOC + 1
        },
        timing: (exp) => 13
    },

    784: {
        identifier: "LN",
        code: 784,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.log(mem[Q(exp, "A")])
            return exp.LOC + 1
        },
        timing: (exp) => 33
    },

    690: {
        identifier: "MOVE",
        code: 690,
        execute: (exp) => {
            mem.splice(Q(exp, "C"), Q(exp, "B") - Q(exp, "A") + 1, ...mem.slice(Q(exp, "A"), Q(exp, "B") + 1))
            return exp.LOC + 1
        },
        timing: (exp) => 3.18 + 0.816 * (Q(exp, "B") - Q(exp, "A") + 1)
    },

    /**
     * Tape and Drum
     */
    532: {
        identifier: "WRTPJ",
        code: 532,
        execute: (exp) => {
            tapes['J'].write(mem.slice(Q(exp, "A"), Q(exp, "B") + 1))
            return exp.LOC + 1
        },
        timing: (exp) => 14 + 1.6 * (Q(exp, "B") - Q(exp, "A") + 1)
    },

    533: {
        identifier: "WRTPK",
        code: 533,
        execute: (exp) => {
            tapes['K'].write(mem.slice(Q(exp, "A"), Q(exp, "B") + 1))
            return exp.LOC + 1
        },
        timing: (exp) => 14 + 1.6 * (Q(exp, "B") - Q(exp, "A") + 1)
    },

    435: {
        identifier: "RFTPJ",
        code: 435,
        execute: (exp) => {
            mem.splice(Q(exp, "A"), Q(exp, "B") - Q(exp, "A") + 1, ...tapes['J'].read().slice(0, Q(exp, "B") - Q(exp, "A") + 1))
            return exp.LOC + 1
        },
        timing: (exp) => 14 + 1.6 * (Q(exp, "B") - Q(exp, "A") + 1)
    },

    556: {
        identifier: "SFTPJ",
        code: 556,
        execute: (exp) => {
            tapes['J'].skipForward()
            return exp.LOC + 1
        },
        timing: (exp) => 14
    },

    546: {
        identifier: "SBTPJ",
        code: 546,
        execute: (exp) => {
            tapes['J'].skipBackwards()
            return exp.LOC + 1
        },
        timing: (exp) => 14
    },

    566: {
        identifier: "EFTPK",
        code: 566,
        execute: (exp) => {
            //This is currently a no-op
            return exp.LOC + 1
        },
        timing: (exp) => 2.832
    },


    /**
     * Extras
     */
    751: {
        identifier: "NOOP",
        code: 751,
        execute: (exp) => {
            return exp.LOC + 1
        },
        timing: (exp) => 2.736
    },

    580: { //I need to change this to only print what's asked for, not 5 each line
        identifier: "PRINT",
        code: 580,
        execute: (exp) => {
            const qa = Q(exp, "A")
            const qb = Q(exp, "B")
            if(qa > qb){
                return exp.LOC + 1
            }

            let line = ""
            for(let i = 0; i < qb - qa + 1; i++) {
                if ( i % 5 == 0){
                    if ( line )
                        printBuffer.push(line)
                    line = "";
                    line = Q(exp, "C") + " " + (i / 5) + " |";
                }
                line += " "  + mem[qa + i];
            }
            if ( line )
                printBuffer.push(line)

            return exp.LOC + 1
        },
        timing: (exp) => 2.896 //This is the smallest average
    },
}

const OP2s: Record<number, TOperation> = {
    104: {
        identifier: "TR",
        code: 104,
        execute: (exp) => {
            return exp.D
        }
    },

    112: {
        identifier: "TRZ",
        code: 112,
        execute: (exp) => {
            if(mem[Q(exp, "C")] === 0){
                return exp.D
            }else{
                return exp.LOC + 1
            }
        }
    },

    115: {
        identifier: "TRMN",
        code: 115,
        execute: (exp) => {
            if(mem[Q(exp, "C")] < 0){
                return exp.D
            }else{
                return exp.LOC + 1
            }
        }
    },

    152: {
        identifier: "SKRA",
        code: 152,
        execute: (exp) => {
            if(RA == exp.D){
                return exp.LOC + 2
            }

            return exp.LOC + 1
        }
    },

    159: {
        identifier: "SKRB",
        code: 159,
        execute: (exp) => {
            if(RB == exp.D){
                return exp.LOC + 2
            }

            return exp.LOC + 1
        }
    },

    162: {
        identifier: "SKRC",
        code: 162,
        execute: (exp) => {
            if(RC == exp.D){
                return exp.LOC + 2
            }

            return exp.LOC + 1
        }
    },

    128: {
        identifier: "TIA",
        code: 128,
        execute: (exp) => {
            RA++
            return exp.D
        }
    },

    126: {
        identifier: "TIB",
        code: 126,
        execute: (exp) => {
            RB++
            return exp.D
        }
    },

    125: {
        identifier: "TIC",
        code: 125,
        execute: (exp) => {
            RC++
            return exp.D
        }
    },

    130: {
        identifier: "TIAB",
        code: 130,
        execute: (exp) => {
            RA++
            RB++
            return exp.D
        }
    },

    127: {
        identifier: "TIBC",
        code: 127,
        execute: (exp) => {
            RB++
            RC++
            return exp.D
        }
    },

    129: {
        identifier: "TIAC",
        code: 129,
        execute: (exp) => {
            RA++
            RC++
            return exp.D
        }
    },

    131: {
        identifier: "TIABC",
        code: 131,
        execute: (exp) => {
            RA++
            RB++
            RC++
            return exp.D
        }
    },

    135: {
        identifier: "TDA",
        code: 135,
        execute: (exp) => {
            RA--
            return exp.D
        }
    },

    139: {
        identifier: "SETRA",
        code: 139,
        execute: (exp) => {
            RA = exp.D
            return exp.LOC + 1
        }
    },

    250: {
        identifier: "SETRB",
        code: 250,
        execute: (exp) => {
            RB = exp.D
            return exp.LOC + 1
        }
    },

    145: {
        identifier: "SETRC",
        code: 145,
        execute: (exp) => {
            RC = exp.D
            return exp.LOC + 1
        }
    },

    205: {
        identifier: "RADDC",
        code: 205,
        execute: (exp) => {
            AC = unpack(mem[exp.D]).C;
            return exp.LOC + 1
        }
    },

    177: {
        identifier: "ADDA",
        code: 177,
        execute: (exp) => {
            AC += unpack(mem[exp.D]).A;
            return exp.LOC + 1
        }
    },

    184: {
        identifier: "ADDB",
        code: 184,
        execute: (exp) => {
            AC += unpack(mem[exp.D]).B;
            return exp.LOC + 1
        }
    },

    190: {
        identifier: "ADDC",
        code: 190,
        execute: (exp) => {
            AC += unpack(mem[exp.D]).C;
            return exp.LOC + 1
        }
    },

    221: {
        identifier: "SUBC",
        code: 221,
        execute: (exp) => {
            AC -= unpack(mem[exp.D]).C;
            return exp.LOC + 1
        }
    },

    
    235: {
        identifier: "STC",
        code: 235,
        execute: (exp) => {
            let i = unpack(mem[exp.D]);
            i.C = AC;
            mem[exp.D] = pack(i);
            return exp.LOC + 1
        }
    },

    123: {
        identifier: "STOP",
        code: 123,
        execute: (exp) => {
            running = false
            return exp.LOC + 1
        }
    }
}

let OP1Map: Record<string, TOperation> = {}
let OP2Map: Record<string, TOperation> = {}

//Invert OP1 and OP2 records to create string -> operation maps
Object.keys(OP1s).forEach((opCode) => {
    const op = OP1s[opCode]
    OP1Map[op.identifier] = op
})

Object.keys(OP2s).forEach((opCode) => {
    const op = OP2s[opCode]
    OP2Map[op.identifier] = op
})

//Handles indirect indexing
function Q(exp: TExpression, arg: string): number{
    const litAddress = exp[arg]

    const Rs = [{ //0
        "A": (exp: TExpression) => exp.A,
        "B": (exp: TExpression) => exp.B,
        "C": (exp: TExpression) => exp.C
    },{ //1
        "A": (exp: TExpression) => exp.A,
        "B": (exp: TExpression) => exp.B,
        "C": (exp: TExpression) => exp.C + RC
    },{ //2
        "A": (exp: TExpression) => exp.A,
        "B": (exp: TExpression) => exp.B + RB,
        "C": (exp: TExpression) => exp.C
    },{ //3
        "A": (exp: TExpression) => exp.A,
        "B": (exp: TExpression) => exp.B + RB,
        "C": (exp: TExpression) => exp.C + RC
    },{ //4
        "A": (exp: TExpression) => exp.A + RA,
        "B": (exp: TExpression) => exp.B,
        "C": (exp: TExpression) => exp.C
    },{ //5
        "A": (exp: TExpression) => exp.A +RA,
        "B": (exp: TExpression) => exp.B,
        "C": (exp: TExpression) => exp.C + RC
    },{ //6
        "A": (exp: TExpression) => exp.A + RA,
        "B": (exp: TExpression) => exp.B + RB,
        "C": (exp: TExpression) => exp.C
    },{ //7
        "A": (exp: TExpression) => exp.A + RA,
        "B": (exp: TExpression) => exp.B + RB,
        "C": (exp: TExpression) => exp.C + RC
    }]

    return Rs[exp.R][arg](exp)
}

function decToBin(i: number | bigint, n: number): Array<0 | 1>{
    const bits = i.toString(2).split("").map(b => parseInt(b) as 0 | 1).slice(0, n)
    return Array(n - bits.length).fill(0).concat(bits)
}

function binToDec(bits: Array<0 | 1>, start?: number, len?: number): number{
    if(typeof start !== "undefined" && typeof len !== "undefined"){
        bits = bits.slice(start, start + len)
    }

    return parseInt(bits.join(""), 2)
}

function pack(exp: TExpression): bigint{
    const bits = [
        0, //Sign
        0, //Pad
        ...decToBin(exp.R, 3),
        0, //Pad
        ...decToBin(exp.OP1, 12),
        ...decToBin(exp.OP2, 8),
        ...decToBin(exp.D, 10),
        0, //Pad
        ...decToBin(exp.A, 10),
        ...decToBin(exp.B, 10),
        0, 0, //Pad
        ...decToBin(exp.L, 3),
        ...decToBin(exp.C, 10)
    ]

    return BigInt("0b" + bits.join(""))
}

export function unpack(n: bigint, l?: number): TExpression{
    const bits = decToBin(n, 72)

    return {
        LOC: l ?? 0,
        sign: true,//IGNORE FOR NOW
        R: binToDec(bits, 2, 3),
        OP1: binToDec(bits, 6, 12),
        OP2: binToDec(bits, 18, 8),
        D: binToDec(bits, 26, 10),
        A: binToDec(bits, 37, 10),
        B: binToDec(bits, 47, 10),
        L: binToDec(bits, 59, 3),
        C: binToDec(bits, 62, 10)
    }
}

export function prettyOp(exp: TExpression){
    let pretty = ""

    if(exp.OP1 in OP1s){
        pretty += OP1s[exp.OP1].identifier
    }

    if(exp.OP2 in OP2s){
        pretty += " " + OP2s[exp.OP2].identifier
    }

    return pretty
}

function loadExpToMem(exp: TExpression){
    mem[exp.LOC] = pack(exp)
}

/*
    String expression format
    LOC OP1 R A B C OP2 D
    IF OP2 or D are empty, they must be -
*/
function strToExp(s: string): TExpression{
    const parts = s.trim().split(/\s+/)

    if(parts.length < 8){
        alert("THAT'S NOT SPEEDCODING!")
    }

    if(!(parts[1] in OP1Map)){
        console.log("Unknown OP1: " + parts[1])
        return unpack(BigInt(0))
    }

    if(parts[6] !== '-' && !(parts[6] in OP2Map)){
        console.log("Unknown OP2: " + parts[6])
        return unpack(BigInt(0))
    }

    return {
        LOC: parseInt(parts[0]),
        sign: true,
        OP1: OP1Map[parts[1]].code,
        R: parseInt(parts[2]),
        A: parseInt(parts[3]),
        B: parseInt(parts[4]),
        L: 0,
        C: parseInt(parts[5]),
        OP2: parts[6] === '-' ? 0 : OP2Map[parts[6]].code,
        D: parts[7] === '-' ? 0 : parseInt(parts[7])
    }
}

export function resetHard(){
    mem = Array(1024).fill(0)
    clearTapes()
    rewindTapes()
    clearPrinter()
}

export function clearPrinter(){
    printBuffer = []
}

export function clearTapes(){
    tapes['J'].clearRecords()
    tapes['K'].clearRecords()
}

export function rewindTapes(){
    tapes['J'].rewind()
    tapes['K'].rewind()
}

export function parseAndLoad(s: string){
    resetHard()

    s.split("\n").forEach((l) => {
        //Remove any trailing comments and whitespace
        l = l.replace(/\/\/.*$/, '').trim();

        //Test if line is expression or data directive
        if(/DATA/.test(l)){
            const parts = l.split(" ")
            let addr = parseInt(parts[0])

            parts.slice(2).forEach((i) => {
                mem[addr] = parseInt(i)
                addr++
            })
        }else if(/[0-9]+\s+[A-Z]+\s+[0-9]\s+[0-9]+\s+[0-9]+\s+[0-9]+\s+[A-Z\-]+\s+[0-9\-]+/.test(l)){
            const exp = strToExp(l)
            loadExpToMem(exp)
        }else if(/^%IP/.test(l)){
            const parts = l.split(' ')
            IP = parseInt(parts[1])
        }else if(/^%TAPE/.test(l)){
            l.trim().split(/\s+/)
            const parts = l.split(' ')

            if(parts[1] in tapes){
                tapes[parts[1]].write(parts.slice(2).map((s) => parseInt(s)))
            }
        }
    })

    //Rewind the tapes!
    rewindTapes()
}

export async function executeExp(exp: TExpression){
    //printState()
    let nextIp = 0
    let timing = 0

    if(exp.OP1 in OP1s && !(exp.OP2 in OP2s)){
        //console.log("Running OP1: " + OP1s[exp.OP1].identifier)
        nextIp = OP1s[exp.OP1].execute(exp)
        timing += typeof OP1s[exp.OP1].timing !== "undefined" ? OP1s[exp.OP1].timing(exp) : 0
    }

    if(exp.OP1 in OP1s && exp.OP2 in OP2s){
        //console.log("Running OP1: " + OP1s[exp.OP1].identifier)
        OP1s[exp.OP1].execute(exp)
        timing += typeof OP1s[exp.OP1].timing !== "undefined" ? OP1s[exp.OP1].timing(exp) : 0

        //console.log("Running OP2: " + OP2s[exp.OP2].identifier)
        nextIp = OP2s[exp.OP2].execute(exp)
        timing += typeof OP2s[exp.OP2].timing !== "undefined" ? OP2s[exp.OP2].timing(exp) : 0
    }

    await sleep(timing)

    return nextIp
}

export async function execute(v: bigint){
    return await executeExp(unpack(v, IP))
}

export async function step(){
    const nextIp = await execute(mem[IP])

    if(typeof nextIp !== 'undefined'){
        IP = nextIp
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}