Debugging
    [x] load any map
    find any NPC
    trigger NPC state
    teleport
    spawn item
    [x] trigger environment state

Optimizations
    apply default properties to all tiles in tileset
    limit screen width for large monitors?
    Resource Pool
        images
        fonts
        etc

Maps
    [x] load map
    [x] enter/exit map areas
    save world state between transitions
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
    [x] night 
    fog 
    rain
        [x] on / off
        rain puddles/drop splash
        ease in / out

environment/items
    [x] dark cave + lantern item
    water + boat
    cliff + rope/ladder
    castle + disguise

weapons
    sword
    bow
    magic wand

screens
    alert popups
    title
    loading screen
    health
    score
    transitions
    inventory
    quest log

items/inventory

game state
    entity state
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

Questing System with FSMs

--------
[x] Demo quest
        talk to npc
        npc tells you 
            (a) something bad lives in the cave and to kill it
            (a) something bad lives in the cave stole a rare item
        go to cave
        (kill monster)
        retrieve rare item
        return to npc
        win
