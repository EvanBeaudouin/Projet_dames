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
    public afficherGrille(): void {
        let ligne = "";
        for (let k = 0; k < this.taille; k++) {
            ligne += "+-----";
        }
        ligne += "+";
        for (let i = 0; i < this.taille; i++) {
            console.log(ligne);
            let row = "";
            for (let j = 0; j < this.taille; j++) {
                row += `|  ${this.grille[i][j]}  `;
            }
            console.log(row + "|");
        }
        console.log(ligne);
    } 
}
let test1 = new Grille();
test1.afficherGrille();
