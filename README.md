This is a partial implementation of Speedcoding, as described here:

https://archive.computerhistory.org/resources/access/text/2018/02/102678975-05-01-acc.pdf

# I've modified the spec!
In order to make SpeedCo usable (without access to a 701 machine room) I've added a few extra comamnds.

The new `DATA` operation lets you load data into memory, for example:

`0100 DATA 1 2 3 4`

Will load `1 2 3 4` into memory starting at address `100`.

`%IP XXXX` will set the initial instruction pointer to `XXXX`.

And finally, we have tape. To load tape use the `%TAPE X` command. That will load a single record to tape `X`. The available tape drives right now are `J` and `K`. Each `%TAPE` command loads a single record. To load multiple records you hit multiple `%TAPE` commands.