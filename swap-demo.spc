%IP 300

//Print some numbers
0300 PRINT 0 0302 0312 0000 - -
0302 DATA 1 2 3 4 5 6 7 8 9

//Swap that to drum
0300 0312 0000 P

//Print some other numbers
0300 PRINT 0 0302 0312 0000 - -

//Jump to a loader
0301 NOOP 0 0000 0000 0000 TR 0400
0302 DATA 11 12 13 14 15 16 17 18 19

//Reload the code I swapped to drum
0400 RFDRP 0 0300 0312 0000 TR 0300