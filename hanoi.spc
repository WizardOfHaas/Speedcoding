//  Calculate the steps to solve the Towers of Hanoi
//  Author: Bill Kuker <bkuker@billkuker.com>
//  Date:   November 2026
//
//  Move stack from peg 1 to peg 3 using peg 2 as the spare.
//  Number of disks is set at instruction 395
//
//  Output is from, two pairs.
//  
//  Recursion is implemented using a stack based function
//  calling convention. Stack grows down from address 1000.
//  Caller places parameters and return instruction on
//  the stack, callee is responsible for popping them off.
//
//  Items of note.
//  - Return instruction can do work (see 0405, 0407)
//  - Return value can be pushed. Not used in this demo
//  - Use base addresses >1000 to peek into the stack
//      - Gets ugly when pushing params too (0401-0404)
//      - Looking >23 back in the stack requires modulo
//  - Does not respect real speadco usable memory range
//

%IP 0390 

0350 DATA 0 1 2 3 4 5 6 7

//hanoi(5, 1, 3, 2);
0390 MOVE   1 0352 0352 1000    TDABC   0391    //Push spare = 2
0391 MOVE   1 0353 0353 1000    TDABC   0392    //Push to = 3
0392 MOVE   1 0351 0351 1000    TDABC   0393    //Push from = 1
0393 MOVE   1 0355 0355 1000    TDABC   0394    //Push n = 5
0394 MOVE   1 0396 0396 1000    TDABC   0395    //Push return instruction
0395 NOOP   0 0000 0000 0000    TR      0400    //call function
0396 NOOP   0 0000 0000 0000    STOP      -


//function hanoi(n, from, to, spare)

//Stack has RET, N, from, to, spare
0400 SUB    5 1002 0351 1002    TRMN    0419   // n = n - 1
                                                // if n < 0 return
//hanoi(n - 1, from, spare, to);
0401 MOVE   7 1004 1004 1000    TDABC   0402    //Push to
0402 MOVE   7 1006 1006 1000    TDABC   0403    //Push spare
0403 MOVE   7 1005 1005 1000    TDABC   0404    //Push from
0404 MOVE   7 1005 1005 1000    TDABC   0405    //Push n-1
0405 MOVE   1 0407 0407 1000    TDABC   0406    //Push return instruction from 0407
0406 NOOP   0 0000 0000 0000    TR      0400    //Call function

//Print FROM, TO
0407 PRINT  6 1003 1004 0000    TR      0411    

//hanoi(n - 1, spare, to, from);
0411 MOVE   7 1003 1003 1000    TDABC   0412    //Push from
0412 MOVE   7 1005 1005 1000    TDABC   0413    //Push to
0413 MOVE   7 1007 1007 1000    TDABC   0414    //Push spare
0414 MOVE   7 1005 1005 1000    TDABC   0415    //Push n-1
0415 MOVE   1 0419 0419 1000    TDABC   0416    //Push return instruction from 0419
0416 NOOP   0 0000 0000 0000    TR      0400    //call function

//UNPOP:
0419 MOVE   6 1001 1001 0424    TIABC   0420    //Pop return instruction to @RET
0420 NOOP   0 0000 0000 0000    TIABC   0421    //Pop n
0421 NOOP   0 0000 0000 0000    TIABC   0422    //Pop from
0422 NOOP   0 0000 0000 0000    TIABC   0423    //Pop to
0423 NOOP   0 0000 0000 0000    TIABC   0424    //Pop spare
0424 NOOP   0 0000 0000 0000    -       -       //Return instruction here