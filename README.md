# webapp-moneymaker

This is a continuation of a really old project of mine (more like a repository for python) where I basically made a super simple python program in which the user is a beggar, who needs to refill water bottles and sell them at some price. I think I didn't continue it cause I couldn't understand how to add a proper loop statement in the code (for the repeating days) but anyways, I've decided to pick it back up, ofc in JavaScript.

Also, this is kinda based off of a text-based game which I played when I was younger, can you figure out what it is?

## Things I wanted to add

- Different locations
    - Railway station (here, cheaper water bottle = more sales)
    - Museum (eh, it's there)
    - Mall (will have the least amount of sales, but if bottles are priced higher here than you make more money in general?)
    - City Hall (you may or may not get shut down, depending on what water you're using)
- Hunger system
    - max can go 3 days without food, after that you die and game ends
    - food costs 10inr per day
- Add "customer feedback" and "loyalty"
    - Basically, with a specific loyalty score, you have a gurantee of getting a certain amount of sales every time you visit a place, but this score can easily fluctuate depending on the price and quality of water. Main point of it would be that the cost of the bottles should be the same as long as possible, if the cost fluctuates, then the loyalty does too
    - Customer feedback will happen and tell about the water, if the water that user uses is almost always river water, then it will give negative feedback like water tasting funny, and ofc less sales


## Devlogs

- 30 Sept 2025
    - Created repository
    - Tried a more "coin collector tycoon" type of thing, I didn't see it having any special or unique qualities so just deleted it all after like... 45 mins of work?
    - Copied the latest ``MM04.py`` from my MoneyMaker repository (https://github.com/ChefYeshpal/MoneyMaker/blob/master/MM0.4.py)
        - Dang I haven't touched that in 2 whole years... time flies by fast.
- 1 Oct 2025
    - Changed the python code to typescript
    - Literally overhauled EVERYTHING
        - Changed the TS script code to js
        - Changed the interface to be more like of the game "A Dark Room"
            - Basically typewriter effects
        - Added some basic logic as to:
            - Higher cost of bottles = lower selling
            - Lower cost of bottles = higher selling
        - Added inventory management (will need to work more on this)
        - Added profit tracking
    - Added inventory check that starts from day 2
    - Added a right click function, so that when the user right clicks it automatically completes the sentence it was writing
        - Also if you press the space bar it does the same thing.
    - Changed the name of the project, from ```webapp-coin_collector_tycoon``` to ```webapp-moneymaker```
        - considering that the 2nd name is much more suitable in my opinion
    - Added link to github repo
- 2 Oct 2025
    - Added achievements
        - Added counting systems
        - Test functions for these achievements
        - Baron -> Earl -> Viscount -> King (or something like that?)
        - Maybe will add more features...
    - Added step-by-step mode
        - Added a button to switch
        - Added autoscroll feature for both mode
    - Added a lil animation for text
        - Now it pops up from under, instead of appearing like houdini
- 3 Oct 2025
    - Trying to add easter eggs...
    - Added a reputation system
        - Sell river water your rep goes down, so does your sales
        - Sell filter water, your rep goes up, and so does your sales
