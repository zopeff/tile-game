8/20/21
So, now that I have things wandering around, I thought I would ahve them do interesting things also. The first thing that jumped to mind is to have them blurt out random thing as if they are talking to themselves. This could also be used later when actual dialog and interactions are in place, so it was something potentially reusable.

I started with the idea that the speech bubbles would be managed with a global object that wrote them to a separate canvas element. This approach ended up not being very usable and i instead just ended up painting all the bubbles onto the same canvas.

It took a while to get the positioning correct as there raelly hasn't been any need for coordinate projections. Each character is just placed into the same tile grid that the map is on, so it's pretty easy. The bubbles on the other hand are not aligned to this and needed a bunch of fiddling to get right.

Getting the NPC to speak also ment that i needed a source of things to say so that ment a bit of refactoring the wandering around code into something that is more similar to finite state machine, though not quite. I expect by the end of this i will end up with a more compelte FSM, but for now it's just step 1.