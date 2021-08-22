8/19/21
OK. the engine is now mostly usable with the basics of loading different maps as you enter buildings, but there really isn't much going on. SO today I added some basic NPC type things that will just wander around. To get this working ment I needed to refactor quite a bit of the player collision detection so that it was more contained within the character code itself rather than outside in the world class. I figured that having the character look to see if they can move to a new square was better than the world checking and then moving the character. THis worked out pretty well and now I should be able to apply this to all the other characters like monsters that I might want to add later. 

I have also added 'animated' tiles as I explore more of what the _Tiled_ map editor is capable of. I really like the animated tiles as it brings the world to life a bit and starts to feel more "real". THough not in a real life sense... just a real game world...

Still not totally happy with how i am marking tiles as walkable or not yet. Currently it's just any tile on level 3 or higher on the map is solid and not able to be walked over. Everything on lower map levels is passible. This could also be done by having a custom property of each tile as passable or not, but that can be done later if i need it.


