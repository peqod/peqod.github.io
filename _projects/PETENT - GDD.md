---
title: Petent GDD
created: 2020-07-09
status: published
threads:
  - making-and-design
---

# **PETENT**

GDD v0.3
Game Design Document
# Theme / Setting / Genre

**Theme:** Post Soviet, SlavCore, Dystopia.

* **Play Time:** Main Story: 8-10 hours Side content: 20+ hours   
* **Setting:**  Tremck, a model PGR (Polskie Gospodarstwo Rolne). Austere charm of Lesser Poland broad plains. Blockhouses thrown near a crossroads in the middle of nowhere. Surrounded by lush, mysterious, untouched forests and bogs. Few facilities are at hand:   
  * general shop,   
  * allotment houses,   
  * church,   
  * cemetery,   
  * artificial pond,   
  * municipal culture house,   
  * and the biggest landfill facility in the region.  
    Three facilities (at the moment) are available offsite:  
* TiT \- abbreviation for Trust, Integrity, Truthfulness. National Social Security. Here you claim your retirement.  
* Hospital \- You may end here when you get hurt. And this happens when you are old.  
* Jail \- You may end here when you do wrong things.  
  No place is active without people.   
  	Tremck is alive. Among its notable inhabitants we have:   
  * Chavs \- the youth element that decided to not to seek chances in a City behind the forest. They usually antagonize the player.  
  * Social Activists \- The neighbors that care to see things, they can report or antagonize you in case of your wrongdoing.   
  * Children \- Children are like little chavs, nobody messes with the children.  
  * Police \- Eventually they will be called. Will you try to escape?  
  * The Man in the Trash \- He lives in trash. Nobody cares what he does there.  
  * Pair with the shopping trolley \- supposedly they dwell in allotment house areas and live from collecting trash. Is that even possible?  
  * The Man with The Car \- He must be important. His car is often broken.  
  * Foreigners \- problematic group of people living in tents near the forest.  
  * Helen \- She can be seen in places. Your heart beats faster near her. Aren’t you too old for that?  
  * Priest \- He can give you jobs or tasks to do around the church and community.   
  * Mystery-Man in a Coat \- He hides around the neighborhood in random places (bushes/behind a garage). Should he be approached?   
  * The Hermit \- He sometimes sits on a bench near your house. He looks wise and probably knows a lot.   
  * Upstairs Neighbor \- He often looks out through his window. He sees a lot of what’s been going on. Perhaps befriending him can help you find things?  
  * The Whore \- She sometimes stands in random places waiting for love. 

![][image1]

*One of locations, front of the blockhouse. As seen in the Trailer.*

		**Genre:** Adventure/Exploration/Survival

# General Assumptions

Petent is an open ended exploratory/adventure game limited by time. 

**Agency**

The gameplay itself is based on movement and interaction, including physical interaction with the reactive environment. Player needs to balance the main character as he can fall easily. Things can be pushed, broken or tipped over. NPCs can be prompted to verbal interaction (greet/aggravate choice) or physical like any other object.  
NPCs can either answer verbal cues in text or engage in chase/pushover sequence with the player when triggered by circumstances.

This is the core of the game. This creates emergent gameplay and allow s the agency of the Player.

**“Main Plot”**

Plot is centred around survival. The game provides the player with multiple options to make enough income to make ends meet. The player is prompted to either collect his benefits from the Social Security Office, work menial jobs, do favors for NPC’s, seek opportunities on the Intranet or in his neighborhood. Examples:

* Player can seek love.  
* Player can collect trash to earn a living.  
* Player can work in nearby facilities (this means completing minigames like sorting trash or vaccinating cod fish)  
* Player can venture and seek alternative dwelling outside.  
* Player can stay at home and sleep, listen to radio, browse the intranet (it’s a thing) or read.  
* When money runs out the Police throws the Player out. He can then earn his way back or seek alternative routes.  
* Player can seek ways to die.  
* Player can try to help foreigners.  
* Player can sell fake products on Scamazon.  
* Player can manipulate the tokenized Scrap Markets.

Etc.

# Mechanics

**Time**  
Player has limited time. Game is set on the span of xx days (length requires calibration) in which Player may learn that the Main Character is terminally ill.

**Time progression**  
Time can progress by traversing from “screen to screen”, or can be passing by in real time. *This will require a prototype in place.* 

**Time Limit**

At certain time player must be prompted to get back to a safe place in order of closing the loop. Limit can be either automatic or interactive. The latter can be a Police hour where after a certain time policemen start to chase the Player. *This will require a prototype in place.* 

**Movement and physics**  
The Main Character requires attentive input to move at full capacity. I’ve designed a movement system based on balancing the cursor distance from the character. If the Player sways too abruptly or too far \- Main Character falls. You can rise faster by mashing rhythmically the mouse buttons. Abundant ragdoll physics are needed.

It remains to be balanced and solved by testing to see how introduction of limits like health/stamina/contusions can enrich the gameplay. There is potential upside of possibilities like a series of items/actions needed to fix the Main Character.

*\[In theory after passing a certain threshold the Main Character should be spawned at the hospital. In case of lack of funds he may try to escape the hospital in form of a minigame. \]*

*This will require a prototype in place.* 

**Interactions**

Objects in game have three possible interactions:

* Investigate: This opens a dialogue with two main option for the player, either greet or aggravate, or yes/no.

* Grab: Grab a stick or a NPC\!

* Push: when the Player runs into the object, some objects can be broken. 

## **Interactions, dialogue**

As shown in mockups

![][image2]

![][image3]

# Storyline and immersion

**The World**

As mentioned above, Tremck consist of multiple locations and is set in a stylised world viewed from top down. The world itself have a dynamic weather and lightning system. The world is a place in which Player encounters random spawned or hard coded events and decides on the type of interaction.

**The Social Security Loop**

Plot suggests that the player should go to TiT (Social Security Company) and claim his retirement benefits by completing a series of “arcade puzzles” in the mazes of TiT office. Said puzzles consist of:

![][image4]

* **The Line:** Isometric side scrolling view, Player needs to navigate a corridor to reach in time particular doors or window in the TiT Office. Destroying things along the way diminishes the reward and time.

![][image5]

* **The Stamps:** Player is tasked with collecting proper stamps and papers from various offices. Open maze, standard topdown view, time limit \- office closes soon. Damage is accounted for.

![][image6]

![][image7]

![][image8]

*Stamp Game as seen in the mockup build.* 

* **Word Game:** Player needs to arrange the words in order. Bon Ton goes a long way. 

![][image9]

*Word Game  prototype as seen in the Trailer*

Mid/early game Main Character starts to display pain, by temporarily slowing down and prompting the Player to go to hospital. This remains optional, but is crucial to reach one of three possible “positive endings”.  
In hospital the Player is prompted that the Main Character is ill and has xx days to gather a big sum for the treatment. If the Player manages to do it, then “the game” ends with a cutscene showing the Main Character going to the hospital for treatment. This enables New Game+ where you can wander around the map in “endless mode”, limited only by

**Death.**

Being old is precarious. Death leads to the end of the game. Are you cruel enough to seek all the ways in which you can die?

* Will you try to climb the building and jump?  
* Will you step under the bus?  
* Will you provoke chavs?  
* Will you read the entirety of War and Peace?  
* Will you wander into the forest at night?  
* Will you want to check if the old boat does float?  
* Will you try to fix the outlet?  
* Will you walk into fire?  
* Will you walk on water?  
* Etc.

**Outside the Loop:**

If the Player decides not to go to TiT, then he can pursue other courses of action.  
As mentioned above \- he can collect litter and sell it in the facility. He can work in the facility itself. He can seek love. He can seek knowledge about the world he lives in. He can use a computer to browse the intranet, get scammed or buy clothes (obviously). He can become a radical, he can fish or work at a fish vaccination facility etc.

# Day outside the Social Security loop

*To picture the game better, this is a rundown of a possible gameplay, step by step.*

1. Day fades from black with the Raban Alarm Clock. Raban Alarm Clock has a dialogue with four buttons \- radio or buzzer alarm \- Whether you choose, it will start the day. You need to select to turn it off or on to turn it on. Turning it on for the second time defaults to the radio.. Game comes with a radio station that sports a good deal of terrible music and announcements.

![][image10]

*The lookdev view of the dwelling loop*

2. You have multiple choices here. You can go to the dresser and select your clothes for example.  
   ![][image11]

   *Prototype of the dressing UI*

*If you choose to go out without clothes, then be ready that your neighbors will probably call the Police.*

3. You can read books on the shelf (contains a full version of Dziady in German language; War and Peace, photo albums of dubious quality, a Game Manual called “the Great Book of Drudgery” etc.)

![][image12]

*We are serious.*

	In short you can interact with all the items in the room, some of them have a multilevel “mini stories”. Like the flower, which you can water. If you do not, then after a few days it becomes a dry sad stick. On the other hand if you water it too much, then the water overflows the pot, the flower becomes rotten brown and the fungi-like stain develops on the wall.

*The game world is filled to the brim with props and npc’s that unfold their stories and impact the experience whenever the Player chooses to interact with them.* 

4. Player goes out. The morning is misty and gray. Next to the block two men are going with a shopping trolley (possible random encounter). They stop to collect bottles and cans, which spawn at random places and quantities each day.   
   1. If the Player decides to talk to them, then they inquire for some spare change or whatever. If the Player chooses a positive interaction, then NPCs tell him that he can collect some stuff like they do, so that he can exchange it in the facility.  
   2. If the Player decides to mimic the behavior of NPCs and do it in their view cone, then they will chase him to push him over (don’t mess with our business\!)  
   3. If the Player already knows the game or predicts correctly, he will stay out of sight of bums and instead follow them or go the other way in hope of not encountering other collectors.

5. With trash collected he can go to the facility and offload the trash at one gate. Price of trash is established randomly every day.   
   *\[Conveniently, the next gate is described as “workers needed”. Entering it launches a trash sorting game. \]*  
   1. In case the Player thinks the price is too high or low, he can offload the trash in any place, risking that a random bum spawn will find it.   
   2. The one safe place to offload trash is the room, but alas, it makes the room dirty and after a certain threshold the Police enters and puts a fine on the player.  
6. Player decides to sell the trash. He then decides to take the bus back to the blocks. After paying a small fee the Player fast travels back.  
7. On spot the Player sees one of chavs spraying the wall.  
   1. If the Player steps into the view cone of the chav, he becomes aggressive and starts the chase.  
      ![][image13]

   2. If the Player goes out of the view, he passes unnoticed and can go home in order to rest safely.

# Targeted platforms

* PC  
* TvOS  
* Nintendo Switch  
* Steam Deck

# Target groups

* …  
* PEGI ?

# Project Scope 

Vertical slice: In order to have a proper vs, the game needs all of its core mechanics in place. 
Then we still will need to decide on what exactly should be implemented for the runtime.  
Petent is specific, ie. We see its strength in the whole experience. Not in the parts of it. 

# Influences 

[Sneaky Sasquatch](https://www.youtube.com/watch?v=tmcufCv-99A) \- Pretty much everything.  
[Boku no Natsuyasumi](https://en.wikipedia.org/wiki/Boku_no_Natsuyasumi) \- a cult playstation 1 title allowing the Player to experience a piece of vacation of a small boy. The open ended structure of this title, visual style, it has it all (without physics, the dark humor, and structure we bring in form of TiT games.)

ExAnima \- The physics\!

Tokimeki Memorial \- Methods of introducing and leading narration, nonlinearity, freedom of choice

[https://store.steampowered.com/app/837470/Untitled\_Goose\_Game/](https://store.steampowered.com/app/837470/Untitled_Goose_Game/)  the style is appealing!

# The Elevator Pitch

Petent invites players into an open-ended exploration of survival, choice, and consequence. In a world where every interaction, decision, and minute counts. Petent offers a unique gaming experience that combines the physical interactions of ExAnima, the open-ended structure of narration as seen in Boku no Natsuyasumi or Sneaky Sasquatch.

Navigate the complexities of old age, societal expectations, and personal fulfillment in a game where the choice is up to you.   
Petent is a journey through the soul disguised in a bitter-sweet comedy.

# 

# What sets this project apart?

## **Everything. As far as we are concerned there is no such game as Petent.**