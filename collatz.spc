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
0400 DATA 0 1 2 3           // Integer Constants
0404 DATA 314159            // pi (Division done in init)
0405 DATA 100000            // pi/2 (Calculated on init)

// ========= Variables
0406 DATA 0                 // scratch for even / odd computation
0407 DATA 1                 // i - The starting point we are working from
0408 DATA 1                 // n - The step in the process along the way

// ========= Entry Point
%IP 0309
// Init:
0309 NOOP   0 0001 0000 0000    RADDC   0309    // AddressCounter = 0
0310 DIV    0 0404 0405 0404    SETRB   0       // Do a division to make Pi correct
                                                // Rb = 0
0311 DIV    0 0404 0402 0405    SETRC   0       // Another division to get the Pi/2 constant
                                                // Rc = 0
// NextSequence:
0312 ADD    0 0401 0407 0407    ADDA    0309    // i++
                                                // AddressCounter++
0313 MOVE   0 0407 0407 0408    SETRC   0       // n = i
                                                // Rc = 0
0314 NOOP   0 0000 0000 0000    STC     0315    // 0035.C = AddressCounter
0315 PRINT  2 0430 0429 0000    SETRB   0       // Print values from 30 to 29[Rb]
                                                // Rb = 0

// NextStep:
0316 MOVE   1 0408 0408 0430    TIBC    0317    // Move current N to 30[Rc]
                                                // Rb++
                                                // Rc++

0317 SUB    0 0408 0407 0406    TRMN    0312    // if ( n < i ) goto NextSequence

0318 MPY    0 0408 0404 0406    -       -       // scratch = n * pi
0319 ADD    0 0406 0405 0406    -       -       // scratch += pi/2
0320 SINE   0 0406 0400 0406    TRMN    0322    // scratch = sin(scratch)
                                                // if (scratch < 0) goto Odd, else continue to Even

// Even:
0321 DIV    0 0408 0402 0408    TR      0316    // n = n / 2
                                                // goto NextStep

// Odd:
0322 MPY    0 0408 0403 0408    -       -       // n = n * 3
0323 ADD    0 0408 0401 0408    TR      0316    // n = n + 1
                                                // goto NextStep
