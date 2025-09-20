class Grille {
    private grille: string[][];
    private taille: number;

    constructor(taille : number =10) {
        this.taille=taille
        this.grille=[];
        this.initialiserGrille();
    }

    private initialiserGrille(): void {
        this.grille=[]
        for (let i =0;i<this.taille;i++){
            this.grille[i]=[]
            for (let j=0;j<this.taille;j++){
                this.grille[i][j]=" ";
            }
        }
    }  
}
