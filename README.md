This is a partial implementation of Speedcoding, as described here:

https://archive.computerhistory.org/resources/access/text/2018/02/102678975-05-01-acc.pdf

# How to SpeedCode
This is a TS implementation, mainly so I can have data types for my sloppy code. To build and run just:

`npm i`

`npm run build`

And then open the index.html in the root directly. That will take you to the web frontend.

I'm planning to have a command line entry point aswell, but the web front makes debugging way easier.

# I've modified the spec!
In order to make SpeedCo usable (without access to a 701 machine room) I've added a few extra comamnds.

The new `DATA` operation lets you load data into memory, for example:

`0100 DATA 1 2 3 4`

Will load `1 2 3 4` into memory starting at address `100`.

`%IP XXXX` will set the initial instruction pointer to `XXXX`.

And finally, we have tape. To load tape use the `%TAPE X` command. That will load a single record to tape `X`. The available tape drives right now are `J` and `K`. Each `%TAPE` command loads a single record. To load multiple records you hit multiple `%TAPE` commands.