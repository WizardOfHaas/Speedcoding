//  Calculate the steps to solve the Towers of Hanoi
//  Author: Bill Kuker <bkuker@billkuker.com>
//  Date:   November 2026
//
//  Move stack from peg 1 to peg 3 using peg 2 as the spare.
//  Number of disks is set at instruction 95
//
//  Output is from, two pairs.
//  
//  Recursion is implemented using a stack based function
//  calling convention. Stack grows down from address 200.
//  Caller places parameters and return instruction on
//  the stack, callee is responsible for popping them off.
//
//  Items of note.
//  - Return instruction can do work (see 0105, 0107)
//  - Return value can be pushed. Not used in this demo
//  - Use base addresses >0200 to peek into the stack
//      - Gets ugly when pushing params too (0101-0104)
//  - Does not respect real speadco usable memory range
//

%IP 0090 

0000 DATA 0 1 2 3 4 5 6 7

//hanoi(5, 1, 3, 2);
0090 MOVE   1 0002 0002 0200    TDABC   0091    //Push spare = 2
0091 MOVE   1 0003 0003 0200    TDABC   0092    //Push to = 3
0092 MOVE   1 0001 0001 0200    TDABC   0093    //Push from = 1
0093 MOVE   1 0005 0005 0200    TDABC   0094    //Push n = 5
0094 MOVE   1 0096 0096 0200    TDABC   0095    //Push return instruction
0095 NOOP   0 0000 0000 0000    TR      0100    //call function
0096 NOOP   0 0000 0000 0000    STOP      -


//function hanoi(n, from, to, spare)

//Stack has RET, N, from, to, spare
0100 SUB    5 0202 0001 0202    TRMN    0119   // n = n - 1
                                                // if n < 0 return
//hanoi(n - 1, from, spare, to);
0101 MOVE   7 0204 0204 0200    TDABC   0102    //Push to
0102 MOVE   7 0206 0206 0200    TDABC   0103    //Push spare
0103 MOVE   7 0205 0205 0200    TDABC   0104    //Push from
0104 MOVE   7 0205 0205 0200    TDABC   0105    //Push n-1
0105 MOVE   1 0107 0107 0200    TDABC   0106    //Push return instruction from 0107
0106 NOOP   0 0000 0000 0000    TR      0100    //Call function

//Print FROM, TO
0107 PRINT  6 0203 0204 0000    TR      0111    

//hanoi(n - 1, spare, to, from);
0111 MOVE   7 0203 0203 0200    TDABC   0112    //Push from
0112 MOVE   7 0205 0205 0200    TDABC   0113    //Push to
0113 MOVE   7 0207 0207 0200    TDABC   0114    //Push spare
0114 MOVE   7 0205 0205 0200    TDABC   0115    //Push n-1
0115 MOVE   1 0119 0119 0200    TDABC   0116    //Push return instruction from 0119
0116 NOOP   0 0000 0000 0000    TR      0100    //call function

//UNPOP:
0119 MOVE   6 0201 0201 0124    TIABC   0120    //Pop return instruction to @RET
0120 NOOP   0 0000 0000 0000    TIABC   0121    //Pop n
0121 NOOP   0 0000 0000 0000    TIABC   0122    //Pop from
0122 NOOP   0 0000 0000 0000    TIABC   0123    //Pop to
0123 NOOP   0 0000 0000 0000    TIABC   0124    //Pop spare
0124 NOOP   0 0000 0000 0000    -       -       //Return instruction here