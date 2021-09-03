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
    [x] draw small maps in the center of the screen

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
    [x] smooth map / walk animation
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
    trigger behaviour - cause NPC to do something
        from a quest
        from a map event

enemy
    [x] kill/remove
    types
    walk
    attack
    die

sound
    bg music
    effects

story / quests
    [x] quest
    cinematics
    generate NPC dialog data from text file
    [x] new quest - "first talk to ron"
    intro dialog to explain controls

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

weapons / armour / items
    sword
    bow
    magic wand
    wings/jetpack/flight


screens
    [x] alert/toast popups
    title
    loading screen
    health
    score
    [x] transitions
    inventory
    [x] quest log
    dialog indicator for more text?
    character names on speech bubbles?
    [x] instructions/help

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


--------
progressive map reveal/fog of war?
    every where?
    just caves?
houses where the roof is removed rather than load a new map?
