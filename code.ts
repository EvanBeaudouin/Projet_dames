class Grille {
    private grille: string[][];
    private taille: number;

    constructor(taille : number =10) {
        this.taille=taille
        this.grille=[];
        this.initialiserGrille();
        this.placerPions();
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
    private placerPions(): void {
        for (let i = 0; i < 4; i++) {
            let start = i % 2;
            for (let j = start; j < this.taille; j += 2) {
                this.grille[i][j] = "N";
            }
        }
        for (let k = this.taille - 4; k < this.taille; k++) {
            let start = k % 2; 
            for (let l = start; l < this.taille; l += 2) {
                this.grille[k][l] = "B";
            }
        }
    }
}
class Pion {
    public type: "pion" | "dame";
    public couleur: "N" | "B";
    public elimine: boolean;

    constructor(couleur: "N" | "B") {
        this.type = "pion";
        this.couleur = couleur;
        this.elimine = false;
    }

    public transformerEnDame(): void {
        this.type = "dame";
    }

    public eliminer(): void {
        this.elimine = true;
    }

    public getSymbole(): string {
    if (this.type === "dame") {
        return this.couleur + "D";
    } else {
        return this.couleur;
    }
}
}
let test1 = new Grille();
test1.afficherGrille();
