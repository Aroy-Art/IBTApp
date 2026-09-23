# Internet Bank Transaction App (Course Project)

##

### Possable race condisions

So as long both `loadTransactions` and `saveTransactions` use sync I/O (`readFileSync`/`writeFileSync`)
we dont get a race condition because Node.js is single-threaded — sync ops block the event loop,
so handlers can't interleave.
