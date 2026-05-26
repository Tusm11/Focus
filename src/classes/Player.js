// Player class
class Player{
    constructor(name){
        this.id=Date.now(); 
        this.name = name;
        this.level = 1;
        this.xp=0;
        this.xpToNextLevel=1000;
        this.gold=0;
        this.streak=0;
        this.totalFocusTime=0;
        this.class=null; //scholar,monk,warrior, alchemist
        this.skillPoints=0;
        this.skills={};
        this.pet=null;
    }
}