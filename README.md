# webapp-moneymaker
This is a continuation of a really old project of mine (more like a repository for python) where I basically made a super simple python program in which the user is a beggar, who needs to refill water bottles and sell them at some price. I think I didn't continue it cause I couldn't understand how to add a proper loop statement in the code (for the repeating days) but anyways, I've decided to pick it back up, ofc in TypeScript.

## Things I wanted to add
- A small box on the top right, that shows amount of money, unsold bottles, etc along with the current day number
- Different locations
    - Railway station (here, cheaper water bottle = more sales)
    - Museum (eh, it's there)
    - Mall (will have the least amount of sales, but if bottles are priced higher here than you make more money in general?)
    - City Hall (you may or may not get shut down)


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
    - Changed the name of the project, from ```webapp-coin_collector_tycoon``` to ```webapp-moneymaker```
        - considering that the 2nd name is much more suitable in my opinion