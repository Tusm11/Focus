// Boss class
class Boss{
    constructor(name,description,maxHP,difficulty){
        this.id=this.id;
        this.name = name;
    this.description = description;
    this.maxHP = maxHP;
    this.currentHP = maxHP;
    this.difficulty = difficulty; //easy,medium,hard
    this.reward = 500; //XP reward for defeating
    this.defeated = false;
    this.createdAt = Date.now();
    this.defeatedAt = null;
    }
}