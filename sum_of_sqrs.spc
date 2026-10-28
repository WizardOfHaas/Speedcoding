//SUM OF SQUARES
//Memory used:
// 0000 - Iterator, starts at 1
// 0001 - Running sum
// 0002 - Current square
// 0003 - MY SPARE 1

//top_of_loop:
//  multiply iterator by itself
//  add that to running total
//  print what I got
//  increment
//  if i < MAX jump to top_of_loop


%IP 0099

0000 DATA 1 0 0 1

0099 NOOP 0 0000 0000 0000 SETRA 0000 //Set upper bound for loop
0100 MPY 0 0000 0000 0002 - - //Square the iterator
0101 ADD 0 0002 0001 0001 - - //Add the square to sum
0102 PRINT 0 0000 0002 0000 - - //Print it
0103 ADD 0 0000 0003 0000 SKRA 0050 //Increment, skips transfer if [0000] == 5
0104 NOOP 0 0000 0000 0000 TIA 0100 //Uncond trasnfer