// Pet class
class Pet{
    constructor(name,type){
        this.id=Date.now();
        this.name=name;
        this.type=type; //dragon,fox,wolf,robot,owl
        this.stage='baby'; //egg,baby,young, adult, legendary
        this.happiness=50;
        this.xp=0;
        this.level=1;
        this.createdAt=Date.now();
    }
}
