//  Ackerman Function
//  Author: Bill Kuker <bkuker@billkuker.com>
//  Date:   November 2026
//
//  Demonstrates function calls with return values
//  and nested recursion

%IP 0310 

0380 DATA 0 1 2 3 4 5 6 7


0310 MOVE   1 0384 0384 1000    TDABC   0311    //Push n = 4
0311 MOVE   1 0383 0383 1000    TDABC   0312    //Push m = 3
0312 MOVE   1 0314 0314 1000    TDABC   0313    //Push return instruction
0313 NOOP   0 0000 0000 0000    TR      0350    //call function
0314 PRINT  6 1001 1001 0000    TIABC   0315    //Print & Pop
0315 NOOP   0 0000 0000 0000    STOP    0315

0340 DATA 0 //Return value

//function ackermann(m, n)
//    if (m === 0)
0350 NOOP   1 0000 0000 1002    TRPL    0360    //Jump if M > 0
//        return n + 1;
0351 ADD    4 1003 0381 0340    TR      0390    //@40 = N+1
                                                //GOTO Return

//    if (n === 0)
0360 NOOP   1 0000 0000 1003    TRPL    0370    //Jump if N > 0
//        return ackermann(m - 1, 1);
0361 MOVE   1 0381 0381 1000    TDABC   0362    // push 1
0362 SUB    5 1003 0381 1000    TDABC   0363    // push m-1
0363 MOVE   1 0365 0365 1000    TDABC   0364    //Push return instruction
0364 NOOP   0 0000 0000 0000    TR      0350    // call function
0365 MOVE   6 1001 1001 0340    TIABC   0390    //Pop result to @40
                                                //GOTO Return

// BBBB
//    return ackermann(m - 1, ackermann(m, n - 1));
0370 SUB    5 1003 0381 1000    TDABC   0371    //Push n-1
0371 MOVE   7 1003 1003 1000    TDABC   0372    //Push m
0372 MOVE   1 0374 0374 1000    TDABC   0373    //Push return
0373 NOOP   0 0000 0000 0000    TR      0350    // call function
0374 SUB    5 1003 0381 1000    TDABC   0375    //return instruction
                                                //At this point return value is on top of stack
                                                //Push m - 1
0375 MOVE   1 0377 0377 1000    TDABC   0376    //Push return
0376 NOOP   0 0000 0000 0000    TR      0350    // call function                                             
0377 MOVE   6 1001 1001 0340    TIABC   0390    //Pop result to @40
                                                //GOTO Return

//Return:
0390 MOVE   6 1001 1001 0394    TIABC   0391    //Pop return instruction to @0394
0391 NOOP   0 0000 0000 0000    TIABC   0392    //Pop n
0392 NOOP   0 0000 0000 0000    TIABC   0393    //Pop m
0393 MOVE   1 0340 0340 1000    TDABC   0394    //Push @40 as return value
0394 NOOP   0 0000 0000 0000    -       -       //Return instruction here