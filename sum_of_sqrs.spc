//1D LIFE
//Memory used:
// 0000 - Iterator, starts at 1
// 0001 - Running sum of neighbors
// 0002 - Current square
// 0003 - MY SPARE 1
// 0004 - MY SPARE 0

//top_of_loop:
//  Reset to start of array
//  Look for neighbors(INDEXED)
//  Count sum, print

%IP 0100

0000 DATA 1 0 0 1 0
//SECRET LEFT HAND 0
0009 DATA 0

//ARRAY of 10 life-forms
0010 DATA 0 1 1 1 0 0 0 0 0 0

//SECRET RIGHT HAND 0
0020 DATA 0

0100 NOOP 0 0000 0000 0000 SETRA 0000
0101 MPY 0 0001 0004 0001 - - //Clear sum
0102 ADD 4 0009 0001 0001 - - //Left hand neighbor
0103 ADD 4 0010 0001 0001 - - //Self
0104 ADD 4 0011 0001 0001 - - //Right hand neighbor
0105 PRINT 0 0001 0002 0000 - - //Print sum
0106 NOOP 0 0000 0000 0000 SKRA 0009
0107 NOOP 0 0000 0000 0000 TIA 0101