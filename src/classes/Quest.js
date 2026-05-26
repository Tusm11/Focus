// Quest class
class Quest{
    constructor(title,description,reward,difficulty){
        this.id=Date.now();
        this.title=title;
        this.description=description;
        this.reward=reward; //XP reward
        this.completed=false; //easy,medium,hard
        this.createdAt=Date.now();
        this.completedAt=null;
    }
}