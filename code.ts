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
        console.log("Mise à jour du jeu");
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

    public deplacerPion(x: number, y: number, direction: "gauche" | "droite", cases?: number): boolean {
    const pion = this.grille[x][y];
    if (!pion) {
        console.log("Pas de pion à cette position !");
        return false;
    }

    let newX: number;
    let newY: number;

    if (pion.type === "pion") {
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
    else {
        if (!cases || cases < 1) {
            console.log("Veuillez indiquer un nombre de cases pour la dame !");
            return false;
        }

        if (pion.couleur === "N") {
            newX = x + cases;
        } else {
            newX = x - cases;
        }

        if (direction === "gauche") {
            newY = y - cases;
        } else {
            newY = y + cases;
        }

        if (newX < 0 || newX >= this.taille || newY < 0 || newY >= this.taille) {
            console.log("Déplacement hors de la grille !");
            return false;
        }

        if (this.grille[newX][newY] !== null) {
            console.log("La case d'arrivée est occupée !");
            return false;
        }

        let stepX: number;
        let stepY: number;

        if (newX > x) {
            stepX = 1;
        } else {
            stepX = -1;
        }

        if (newY > y) {
            stepY = 1;
        } else {
            stepY = -1;
        }

        let checkX = x + stepX;
        let checkY = y + stepY;

        while (checkX !== newX && checkY !== newY) {
            if (this.grille[checkX][checkY] !== null) {
                console.log("Chemin bloqué pour la dame !");
                return false;
            }
            checkX += stepX;
            checkY += stepY;
        }

        this.grille[newX][newY] = pion;
        this.grille[x][y] = null;

        return true;
    }
}
public capturerPion(x: number, y: number, direction: "gauche" | "droite"): boolean {
    const pion = this.grille[x][y];
    if (!pion) {
        console.log("Pas de pion à cette position !");
        return false;
    }

    let dx: number;
    if (pion.couleur === "N") {
        dx = 2; 
    } else {
        dx = -2; 
    }

    let dy: number;
    if (direction === "gauche") {
        dy = -2;
    } else {
        dy = 2;
    }

    const cibleX = x + dx;
    const cibleY = y + dy;
    const milieuX = x + dx / 2;
    const milieuY = y + dy / 2;

    if (cibleX < 0 || cibleX >= this.taille || cibleY < 0 || cibleY >= this.taille) {
        console.log("Déplacement hors de la grille !");
        return false;
    }

    const pionMilieu = this.grille[milieuX][milieuY];
    if (!pionMilieu || pionMilieu.couleur === pion.couleur) {
        console.log("Aucun pion adverse à capturer !");
        return false;
    }

    if (this.grille[cibleX][cibleY] !== null) {
        console.log("La case d'arrivée est occupée !");
        return false;
    }
    this.grille[cibleX][cibleY] = pion;
    this.grille[x][y] = null;
    pionMilieu.eliminer();
    this.grille[milieuX][milieuY] = null;
    if ((pion.couleur === "N" && cibleX === this.taille - 1) ||
        (pion.couleur === "B" && cibleX === 0)) {
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
test1.deplacerPion(6, 0, "droite");
test1.afficherGrille();
test1.capturerPion(4,2,"gauche");
test1.afficherGrille();
