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
    [x] save world state between transitions
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
    sign - read
    grass - sword

player
    [x] move
    [x] attack
    smooth map / walk animation
    health/damage
    inventory / pickups
    death

npc
    spawn based on condition
        quest
        map 
    walk
        [x] random
        restricted to area
        path
        goal
    [x] speak
    [x] conversation/interact
    trigger behaviour
        quest
        map

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
    [x] quest
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
    alert/toast popups
    title
    loading screen
    health
    score
    transitions
    inventory
    quest log
    dialog indicator for more text

items/inventory

game state
    [x] entity state
    save
        [x] create local object
        hash + checksum
        send to server
    load
        [x] load local object
        anti-tamper

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
