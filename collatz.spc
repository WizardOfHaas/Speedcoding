//  Compute & print the sequences of the Collatz conjecture
//  Author: Bill Kuker <bkuker@billkuker.com>
//  Date:   October 2026
//
//  For each i in 1,2,3,4.....
//      n = i
//      repeat:
//          If n is even divide it by two
//          If n is odd multiply by three and add one
//      until n is one
//
//  The conjecture is that ALL such sequences lead to one.
//
//  Rb and Rc trach the number of times through the inner loop
//  Rc for indexing to save the values of n in addresses 30+, and
//  Rb for controlling how many values to print out.
//
//  The Address Counter tracks the starting point i for each
//  sequence for use in the identification portion of the printout.
//
//  Calculation for a given i stops when n < i, because that n
//  would have been checked earlier in the program

// ========= Constants
0000 DATA 0 1 2 3           // Integer Constants
0004 DATA 314159            // pi (Division done in init)
0005 DATA 100000            // pi/2 (Calculated on init)

// ========= Variables
0006 DATA 0                 // scratch for even / odd computation
0007 DATA 1                 // i - The starting point we are working from
0008 DATA 1                 // n - The step in the process along the way

// ========= Entry Point
%IP 0009
// Init:
0009 NOOP   0 0000 0000 0000    RADDC   0009    // AddressCounter = 0
0010 DIV    0 0004 0005 0004    SETRB   0       // Do a division to make Pi correct
                                                // Rb = 0
0011 DIV    0 0004 0002 0005    SETRC   0       // Another division to get the Pi/2 constant
                                                // Rc = 0
// NextSequence:
0012 ADD    0 0001 0007 0007    ADDA    0012    // i++
                                                // AddressCounter++
0013 MOVE   0 0007 0007 0008    SETRC   0       // n = i
                                                // Rc = 0
0014 NOOP   0 0000 0000 0000    STC     0015    // 0015.C = AddressCounter
0015 PRINT  2 0030 0029 0000    SETRB   0       // Print values from 30 to 29[Rb]
                                                // Rb = 0

// NextStep:
0016 MOVE   1 0008 0008 0030    TIBC     0017   // Move current N to 30[Rc]
                                                // Rb++
                                                // Rc++

//0017 SUB    0 0008 0001 0006    TRZ     0012    // if ( n == 1 ) goto NextSequence
0017 SUB    0 0008 0007 0006    TRMN    0012    // if ( n < i ) goto NextSequence

0018 MPY    0 0008 0004 0006    -       -       // scratch = n * pi
0019 ADD    0 0006 0005 0006    -       -       // scratch += pi/2
0020 SINE   0 0006 0000 0006    TRMN    0022    // scratch = sin(scratch)
                                                // if (scratch < 0) goto Odd, else continue to Even

// Even:
0021 DIV    0 0008 0002 0008    TR      0016    // n = n / 2
                                                // goto NextStep

// Odd:
0022 MPY    0 0008 0003 0008    -       -       // n = n * 3
0023 ADD    0 0008 0001 0008    TR      0016    // n = n + 1
                                                // goto NextStep
