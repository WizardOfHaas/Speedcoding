//  Print the first bunch of numbers in the Fibonacci sequence
//  Author: Bill Kuker <bkuker@billkuker.com>
//  Date:   October 2026

%IP 0310

0330 DATA 1 1 0

0310 NOOP   0 0000 0000 0000    SETRA   0000    // Initialize the Ra index counter to zero
0311 PRINT  0 0330 0330 0000    - -             // Print the value @330
0312 ADD    0 0330 0331 0332    SKRA    30      // Compute the next value @332 = @331 + @332
                                                // If Ra == 30 Skip next instruction
0313 MOVE   0 0331 0332 0330    TIA     0311    // Shift the values down; discard <- @330 <- @331 <- @332
                                                // Increment Ra, goto 311
0314 NOOP   0 0000 0000 0000    STOP    0314    // Stop