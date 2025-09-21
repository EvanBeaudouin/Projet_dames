class Grille {
    private grille: (Pion | null)[][];
    private taille: number;

    constructor(taille: number = 10) {
        this.taille = taille;
        this.grille = [];
        this.initialiserGrille();
        this.placerPions();
    }

    private initialiserGrille(): void {
        this.grille = [];
        for (let i = 0; i < this.taille; i++) {
            this.grille[i] = [];
            for (let j = 0; j < this.taille; j++) {
                this.grille[i][j] = null;
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
                const casePion = this.grille[i][j];
                let contenu = " ";
                if (casePion !== null) {
                    contenu = casePion.getSymbole();
                }
                row += `|  ${contenu}  `;
            }
            console.log(row + "|");
        }
        console.log(ligne);
    }

    private placerPions(): void {
        for (let i = 0; i < 4; i++) {
            let start = i % 2;
            for (let j = start; j < this.taille; j += 2) {
                this.grille[i][j] = new Pion("N");
            }
        }

        for (let k = this.taille - 4; k < this.taille; k++) {
            let start = k % 2;
            for (let l = start; l < this.taille; l += 2) {
                this.grille[k][l] = new Pion("B");
            }
        }
    }

    public deplacerPion(x: number, y: number, direction: "gauche" | "droite"): boolean {
        const pion = this.grille[x][y];
        if (!pion) {
            console.log("Pas de pion à cette position !");
            return false;
        }
        let newX: number;
        let newY: number;
        if (pion.couleur === "N") {
            newX = x + 1;
        } else {
            newX = x - 1;
        }

        if (direction === "gauche") {
            newY = y - 1;
        } else {
            newY = y + 1;
        }

        if (newX < 0 || newX >= this.taille || newY < 0 || newY >= this.taille) {
            console.log("Déplacement hors de la grille !");
            return false;
        }

        if (this.grille[newX][newY] !== null) {
            console.log("Case occupée !");
            return false;
        }

        this.grille[newX][newY] = pion;
        this.grille[x][y] = null;

        if ((pion.couleur === "N" && newX === this.taille - 1) ||
            (pion.couleur === "B" && newX === 0)) {
            pion.transformerEnDame();
        }
        return true;
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
        return this.type === "dame" ? this.couleur + "D" : this.couleur;
    }
}

let test1 = new Grille();
test1.afficherGrille();
test1.deplacerPion(3, 1, "droite");
test1.afficherGrille();
