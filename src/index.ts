import * as fs from 'fs'

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
    execute: (exp: TExpression) => number
}

let mem = Array(1024).fill(0)
let RA = 0;
let RB = 0;
let RC = 0;
let IP = 0;
let running = true;

const OP1s: Record<number, TOperation> = {
    658: {
        identifier: "ADD",
        code: 658,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] + mem[Q(exp, "B")]
            return exp.LOC + 1
        }
    },

    696: {
        identifier: "SUB",
        code: 696,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] - mem[Q(exp, "B")]
            return exp.LOC + 1
        }
    },

    699: {
        identifier: "ADDAB",
        code: 699,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] + Math.abs(mem[Q(exp, "B")])
            return exp.LOC + 1
        }
    },

    703: {
        identifier: "ABADD",
        code: 699,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.abs(mem[Q(exp, "A")]) + Math.abs(mem[Q(exp, "B")])
            return exp.LOC + 1
        }
    },

    715: {
        identifier: "MPY",
        code: 715,
        execute: (exp) => {
            mem[Q(exp, "C")] = mem[Q(exp, "A")] * mem[Q(exp, "B")]
            return exp.LOC + 1
        }
    },

    782: {
        identifier: "SQRT",
        code: 782,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.sqrt(mem[Q(exp, "A")])
            return exp.LOC + 1
        }
    },

    783: {
        identifier: "EXP",
        code: 783,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.E ** mem[Q(exp, "A")]
            return exp.LOC + 1
        }
    },

    784: {
        identifier: "LN",
        code: 784,
        execute: (exp) => {
            mem[Q(exp, "C")] = Math.log(mem[Q(exp, "A")])
            return exp.LOC + 1
        }
    },

    690: {
        identifier: "MOVE",
        code: 690,
        execute: (exp) => {
            mem.splice(Q(exp, "C"), Q(exp, "B") - Q(exp, "A"), ...mem.slice(Q(exp, "A"), Q(exp, "B")))
            return exp.LOC + 1
        }
    },

    751: {
        identifier: "NOOP",
        code: 751,
        execute: (exp) => {
            return exp.LOC + 1
        }
    },

    580: { //I need to change this to only print what's asked for, not 5 each line
        identifier: "PRINT",
        code: 580,
        execute: (exp) => {
            if(exp.A > exp.B){
                return exp.LOC + 1
            }

            for(let i = 0; i < exp.B - exp.A; i += 5){
                console.log(exp.C + " " + (i / 5) + " | " +  mem[exp.A + i] + " "  + mem[exp.A + i + 1] + " " + mem[exp.A + i + 2] + " " + mem[exp.A + i + 3] + " " + mem[exp.A + i + 4])
            }

            return exp.LOC + 1
        }
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

    128: {
        identifier: "TIA",
        code: 128,
        execute: (exp) => {
            RA++
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

function unpack(n: bigint, l?: number): TExpression{
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

function parseAndLoad(s: string){
    s.split("\n").forEach((l) => {
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
        }
    })
}

function executeExp(exp: TExpression){
    //printState()

    if(exp.OP1 in OP1s && !(exp.OP2 in OP2s)){
        //console.log("Running OP1: " + OP1s[exp.OP1].identifier)
        return OP1s[exp.OP1].execute(exp)
    }

    if(exp.OP1 in OP1s && exp.OP2 in OP2s){
        //console.log("Running OP1: " + OP1s[exp.OP1].identifier)
        OP1s[exp.OP1].execute(exp)

        //console.log("Running OP2: " + OP2s[exp.OP2].identifier)
        return OP2s[exp.OP2].execute(exp)
    }
}

function execute(v: bigint){
    return executeExp(unpack(v, IP))
}

function printState(){
    console.log("IP=" + IP + " RA=" + RA + " RB=" + RB + " RC=" + RC)
}

const source = fs.readFileSync(process.argv[2], 'utf8')

parseAndLoad(source)

while(running){
    const nextIp = execute(mem[IP])

    if(typeof nextIp === "undefined"){
        console.log("HALTING FOR SAFETY")
        running = false
    }else{
        IP = nextIp
    }
}