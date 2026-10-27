//1D LIFE
//Memory used:
// 0000 - Iterator, starts at 1
// 0001 - Running sum of neighbors
// 0002 - Current square
// 0003 - MY SPARE 2
// 0004 - MY SPARE 0
// 0005 - MY SPARE 1

//top_of_loop:
//  Reset to start of array
//  Look for neighbors(INDEXED)
//  Count sum, print

%IP 0100

0000 DATA 1 0 0 2 0 1
//SECRET LEFT HAND 0
0009 DATA 0

//ARRAY of 10 life-forms
0010 DATA 0 1 1 1 0 0 0 1 1 0

//SECRET RIGHT HAND 0
0020 DATA 0

//Next gen buffer
0030 DATA 0 0 0 0 0 0 0 0 0 0


//Outer loop counter
0100 NOOP 0 0000 0000 0000 SETRB 0000

//Clear inner loop indexing
0101 NOOP 0 0000 0000 0000 SETRA 0000
0102 NOOP 0 0000 0000 0000 SETRC 0000

//Dump to tape HERE
0103 WRTPJ 0 0010 0020 0000 - -

0104 MPY 0 0001 0004 0001 - - //Clear sum
0105 ADD 4 0009 0001 0001 - - //Left hand neighbor
0106 ADD 4 0010 0001 0001 - - //Self
0107 ADD 4 0011 0001 0001 - - //Right hand neighbor
0108 PRINT 0 0001 0002 0000 - - //Print sum

//If sum == 2... live?
0109 SUB 0 0001 0003 0001 TRZ 0111 //sum = sum - 2, jump if 0
//If sum == 0, 1, or 3, die
0110 MPY 1 0004 0004 0030 TR 0112 //Set buffer location to 0 (dead)
0111 MPY 1 0005 0005 0030 - - //Set buffer location to 1 (alive)

//Send buffer to tape J

0112 NOOP 0 0000 0000 0000 SKRA 0009
0113 NOOP 0 0000 0000 0000 TIAC 0104

//MEMCPY
0114 MOVE 0 0030 0039 0010 TR 0101
