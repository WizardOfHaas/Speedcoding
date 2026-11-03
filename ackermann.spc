//  Ackerman Function
//  Author: Bill Kuker <bkuker@billkuker.com>
//  Date:   November 2026
//
//  Demonstrates function calls with return values
//  and nested recursion

%IP 0010 

0000 DATA 0 1 2 3 4 5 6 7


0010 MOVE   1 0004 0004 1000    TDABC   0011    //Push n = 4
0011 MOVE   1 0003 0003 1000    TDABC   0012    //Push m = 3
0012 MOVE   1 0014 0014 1000    TDABC   0013    //Push return instruction
0013 NOOP   0 0000 0000 0000    TR      0050    //call function
0014 PRINT  6 1001 1001 0000    TIABC   0015    //Print & Pop
0015 NOOP   0 0000 0000 0000    STOP    0015

0040 DATA 0 //Return value

//function ackermann(m, n)
//    if (m === 0)
0050 NOOP   1 0000 0000 1002    TRPL    0060    //Jump if M > 0
//        return n + 1;
0051 ADD    4 1003 0001 0040    TR      0090    //@40 = N+1
                                                //GOTO Return

//    if (n === 0)
0060 NOOP   1 0000 0000 1003    TRPL    0070    //Jump if N > 0
//        return ackermann(m - 1, 1);
0061 MOVE   1 0001 0001 1000    TDABC   0062    // push 1
0062 SUB    5 1003 0001 1000    TDABC   0063    // push m-1
0063 MOVE   1 0065 0065 1000    TDABC   0064    //Push return instruction
0064 NOOP   0 0000 0000 0000    TR      0050    // call function
0065 MOVE   6 1001 1001 0040    TIABC   0090    //Pop result to @40
                                                //GOTO Return

// BBBB
//    return ackermann(m - 1, ackermann(m, n - 1));
0070 SUB    5 1003 0001 1000    TDABC   0071    //Push n-1
0071 MOVE   7 1003 1003 1000    TDABC   0072    //Push m
0072 MOVE   1 0074 0074 1000    TDABC   0073    //Push return
0073 NOOP   0 0000 0000 0000    TR      0050    // call function
0074 SUB    5 1003 0001 1000    TDABC   0075    //return instruction
                                                //At this point return value is on top of stack
                                                //Push m - 1
0075 MOVE   1 0077 0077 1000    TDABC   0076    //Push return
0076 NOOP   0 0000 0000 0000    TR      0050    // call function                                             
0077 MOVE   6 1001 1001 0040    TIABC   0090    //Pop result to @40
                                                //GOTO Return

//Return:
0090 MOVE   6 1001 1001 0094    TIABC   0091    //Pop return instruction to @0094
0091 NOOP   0 0000 0000 0000    TIABC   0092    //Pop n
0092 NOOP   0 0000 0000 0000    TIABC   0093    //Pop m
0093 MOVE   1 0040 0040 1000    TDABC   0094    //Push @40 as return value
0094 NOOP   0 0000 0000 0000    -       -       //Return instruction here