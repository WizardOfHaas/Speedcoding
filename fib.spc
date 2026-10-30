//  Print the first bunch of numbers in the Fibonacci sequence
//  Author: Bill Kuker <bkuker@billkuker.com>
//  Date:   October 2026

%IP 0010

0030 DATA 1 1 0

0010 NOOP   0 0000 0000 0000    SETRA   0000    // Initialize the Ra index counter to zero
0011 PRINT  0 0030 0030 0000    - -             // Print the value @30
0012 ADD    0 0030 0031 0032    SKRA    30      // Compute the next value @32 = @31 + @32
                                                // If Ra == 30 Skip next instruction
0013 MOVE   0 0031 0032 0030    TIA     0011    // Shift the values down; discard <- @30 <- @31 <- @32
                                                // Increment Ra, goto 11
0014 NOOP   0 0000 0000 0000    STOP    0014    // Stop