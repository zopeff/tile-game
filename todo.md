Debugging
    load any map
    find any NPC
    trigger NPC state
    teleport
    spawn item
    trigger environment state

Optimizations
    apply default properties to all
    limit screen width for large monitors?
    Resource Pool
        images
        fonts
        etc

Maps
    [x] load map
    [x] enter/exit map areas
    tiles from multiple tilesets
    map events

animations
    [x] tile
    destruction
    environmental
    reactions
    transitions

interact
    chest
    door
    button
    push/pull

player
    [x] move
    [x] attack
    smooth map / walk animation
    health/damage
    inventory / pickups
    death
npc
    walk
        [x] random
        restricted to area
        path
        goal
    [x] speak
    conversation/interact
enemy
    [x] kill/remove
    types
    walk
    attack
    die
sound
    bg music
    effects
story
    quest
    cinematics
weather
    night 
    fog 
    rain

environment/items
    dark cave + lantern item
    water + boat
    cliff + rope/ladder
    castle + disguise

weapons
    sword
    bow
    magic wand

screens
    title
    loading screen
    health
    score
    transitions

items/inventory

game state
    save
        create local object
        hash + checksum
        send to server
    load

multiplayer?

controls
    gamepad
    touch?


_Real_ Tiles


--------
Demo quest
talk to npc
npc tells you 
    (a) something bad lives in the cave and to kill it
    (a) something bad lives in the cave stole a rare item
go to cave
(kill monster)
retrieve rare item
return to npc
win

