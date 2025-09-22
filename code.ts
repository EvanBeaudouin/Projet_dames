import * as readlineSync from "readline-sync";

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
        let colonnes = "   ";
        for (let c = 1; c <= this.taille; c++) {
            colonnes += "  " + c + " ";
        }
        console.log(colonnes);
        let ligneSep = "  +";
        for (let k = 0; k < this.taille; k++) {
            ligneSep += "---+";
        }
        for (let i = 0; i < this.taille; i++) {
            console.log(ligneSep);
            let indiceLigne = (i + 1).toString();
            if (indiceLigne.length < 2) indiceLigne = " " + indiceLigne;
            let row = indiceLigne + "|";
            for (let j = 0; j < this.taille; j++) {
                const casePion = this.grille[i][j];
                let contenu = casePion ? casePion.getSymbole() : " ";
                row += " " + contenu + " |";
                }
            console.log(row);
        }
        console.log(ligneSep);
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

    public deplacerPion(x: number,y: number,direction: "gauche" | "droite" | "haut-gauche" | "haut-droite" | "bas-gauche" | "bas-droite",cases?: number): boolean {
        const pion = this.grille[x][y];
        if (!pion) {
            console.log("Pas de pion à cette position !");
            return false;
        }
        if (pion.type === "pion") {
            let newX = pion.couleur === "N" ? x + 1 : x - 1;
            let newY = direction === "gauche" ? y - 1 : y + 1;
            if (newX < 0 || newX >= this.taille || newY < 0 || newY >= this.taille) {
                console.log("Déplacement hors de la grille !");
                return false;
            }
            if (this.grille[newX][newY] !== null) {
                console.log("La case est déjà occupée !");
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
        if (!cases || cases < 1) {
            console.log("Veuillez indiquer un nombre de cases pour la dame !");
            return false;
        }
        let dx = 0, dy = 0;
        switch (direction) {
            case "haut-gauche": dx = -cases; dy = -cases; break;
            case "haut-droite": dx = -cases; dy = cases; break;
            case "bas-gauche": dx = cases; dy = -cases; break;
            case "bas-droite": dx = cases; dy = cases; break;
        }
        const newX = x + dx;
        const newY = y + dy;
        if (newX < 0 || newX >= this.taille || newY < 0 || newY >= this.taille) {
            console.log("Déplacement hors de la grille !");
            return false;
        }
        const stepX = dx > 0 ? 1 : -1;
        const stepY = dy > 0 ? 1 : -1;
        let checkX = x + stepX;
        let checkY = y + stepY;
        while (checkX !== newX || checkY !== newY) {
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

    public capturerPion(x: number,y: number,direction: "gauche" | "droite" | "haut-gauche" | "haut-droite" | "bas-gauche" | "bas-droite"): boolean {
        const pion = this.grille[x][y];
        if (!pion) {
            console.log("Pas de pion à cette position !");
            return false;
        }
        if (pion.type === "pion") {
            let dx = pion.couleur === "N" ? 2 : -2;
            let dy = direction === "gauche" ? -2 : 2;
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
            this.grille[milieuX][milieuY] = null;
            pionMilieu.eliminer();
            if ((pion.couleur === "N" && cibleX === this.taille - 1) ||
                (pion.couleur === "B" && cibleX === 0)) {
                pion.transformerEnDame();
            }
            return true;
        }
        const directions = [
            { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
            { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
        ];
        for (let dir of directions) {
            let checkX = x + dir.dx;
            let checkY = y + dir.dy;
            let pionTrouve: Pion | null = null;
            while (checkX >= 0 && checkX < this.taille && checkY >= 0 && checkY < this.taille) {
                const caseCheck = this.grille[checkX][checkY];
                if (caseCheck) {
                    if (caseCheck.couleur !== pion.couleur) {
                        pionTrouve = caseCheck;
                        break;
                    } else {
                        break;
                    }
                }
                checkX += dir.dx;
                checkY += dir.dy;
            }
            if (pionTrouve) {
                const cibleX = checkX + dir.dx;
                const cibleY = checkY + dir.dy;
                if (cibleX < 0 || cibleX >= this.taille || cibleY < 0 || cibleY >= this.taille) continue;
                if (this.grille[cibleX][cibleY] !== null) continue;
                this.grille[cibleX][cibleY] = pion;
                this.grille[x][y] = null;
                this.grille[checkX][checkY] = null;
                pionTrouve.eliminer();
                return true;
            }
        }
        console.log("Aucune capture disponible pour cette dame !");
        return false;
    }

    public getGrille(): (Pion | null)[][] {
        return this.grille;
    }

    private joueurActuel: "N" | "B" = "B";

    public getJoueurActuel(): "N" | "B" {
        return this.joueurActuel;
    }

    public changerJoueur() {
        if (this.joueurActuel === "N") {
            this.joueurActuel = "B";
        } else {
            this.joueurActuel = "N";
        }
    }

    public pionBloque(x: number, y: number): boolean {
        const pion = this.grille[x][y];
        if (!pion || pion.elimine) {
            return true;
        }
        const directions = [
            {dx: 1, dy: 1},   
            {dx: 1, dy: -1},  
            {dx: -1, dy: 1},  
            {dx: -1, dy: -1}  
        ];
        for (let dir of directions) {
            let x1 = x + dir.dx;
            let y1 = y + dir.dy;
            let x2 = x + 2 * dir.dx;
            let y2 = y + 2 * dir.dy;
            if (
                (x1 >= 0 && x1 < this.taille && y1 >= 0 && y1 < this.taille && this.grille[x1][y1] === null) ||
                (x2 >= 0 && x2 < this.taille && y2 >= 0 && y2 < this.taille && this.grille[x2][y2] === null)
            ) {
                return false;
            }
        }
        return true;
    }

    public estPartieTerminee(couleur: "N" | "B"): boolean {
        for (let i = 0; i < this.taille; i++) {
            for (let j = 0; j < this.taille; j++) {
                const pion = this.grille[i][j];
                if (pion && pion.couleur === couleur && !pion.elimine) {
                    if (!this.pionBloque(i, j)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public captureDisponible(couleur: "N" | "B"): boolean {
        for (let i = 0; i < this.taille; i++) {
            for (let j = 0; j < this.taille; j++) {
                const pion = this.grille[i][j];
                if (pion && pion.couleur === couleur && !pion.elimine) {
                    if (this.peutCapturer(i, j)) return true;
                }
            }
        }
        return false;
    }

    public peutCapturer(x: number, y: number): boolean {
        const pion = this.grille[x][y];
        if (!pion) return false;
        if (pion.type === "pion") {
            const directions = pion.couleur === "N"
            ? [ { dx: 1, dy: 1 }, { dx: 1, dy: -1 } ] 
            : [ { dx: -1, dy: 1 }, { dx: -1, dy: -1 } ]; 
            for (let dir of directions) {
                const milieuX = x + dir.dx;
                const milieuY = y + dir.dy;
                const cibleX = x + 2 * dir.dx;
                const cibleY = y + 2 * dir.dy;
                if (cibleX >= 0 && cibleX < this.taille && cibleY >= 0 && cibleY < this.taille) {
                    const pionMilieu = this.grille[milieuX][milieuY];
                    if (pionMilieu && pionMilieu.couleur !== pion.couleur && this.grille[cibleX][cibleY] === null) {
                        return true;
                    }
                }
            }
            return false;
        }
        const directions = [
            { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
            { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
        ];
        for (let dir of directions) {
            let checkX = x + dir.dx;
            let checkY = y + dir.dy;
            let pionTrouve: Pion | null = null;
            while (checkX >= 0 && checkX < this.taille && checkY >= 0 && checkY < this.taille) {
                const caseCheck = this.grille[checkX][checkY];
                if (caseCheck) {
                    if (caseCheck.couleur !== pion.couleur) {
                        pionTrouve = caseCheck;
                        break;
                    } else {
                        break;
                    }
                }
                checkX += dir.dx;
                checkY += dir.dy;
            }
            if (pionTrouve) {
                const cibleX = checkX + dir.dx;
                const cibleY = checkY + dir.dy;
                if (cibleX >= 0 && cibleX < this.taille && cibleY >= 0 && cibleY < this.taille &&
                    this.grille[cibleX][cibleY] === null) {
                    return true;
                }
            }
        }
        return false;
    }
}

function jouerJeu() {
    const jeu = new Grille();
    let partieTerminee = false;
    while (!partieTerminee) {
        jeu.afficherGrille();
        console.log(`Joueur actuel : ${jeu.getJoueurActuel()}`);
        const capturePossible = jeu.captureDisponible(jeu.getJoueurActuel());
        let actionValide = false;
        while (!actionValide) {
            let x: number;
            let y: number;
            while (true) {
                x = Number(readlineSync.question("Entrez la ligne du pion (1-10) : ")) - 1;
                y = Number(readlineSync.question("Entrez la colonne du pion (1-10) : ")) - 1;
                if (x >= 0 && x < 10 && y >= 0 && y < 10) break;
                console.log("Coordonnées invalides !");
            }
            const pion = jeu.getGrille()[x][y];
            if (!pion || pion.couleur !== jeu.getJoueurActuel()) {
                console.log("Pion invalide !");
                continue;
            }
            let direction: "gauche" | "droite" | "haut-gauche" | "haut-droite" | "bas-gauche" | "bas-droite";
            if (pion.type === "pion") {
                while (true) {
                    direction = readlineSync.question("Direction (gauche/droite) : ") as any;
                    if (direction === "gauche" || direction === "droite") break;
                    console.log("Direction invalide !");
                }
            } else {
                while (true) {
                    direction = readlineSync.question("Direction (haut-gauche / haut-droite / bas-gauche / bas-droite) : ") as any;
                    if (["haut-gauche", "haut-droite", "bas-gauche", "bas-droite"].indexOf(direction) !== -1) break;
                    console.log("Direction invalide !");
                }
            }
            let cases: number | undefined;
            if (pion.type === "dame") {
                while (true) {
                    cases = Number(readlineSync.question("Combien de cases pour la dame ? "));
                    if (!isNaN(cases) && cases > 0) break;
                    console.log("Nombre de cases invalide !");
                }
            }
            if (capturePossible) {
                let pionPeutCapturer = true;
                while (pionPeutCapturer) {
                    if (jeu.capturerPion(x, y, direction)) {
                        actionValide = true;
                        jeu.afficherGrille();
                        if (jeu.peutCapturer(x, y)) {
                            console.log("Vous pouvez encore capturer avec ce pion !");
                            if (pion.type === "pion") {
                                direction = readlineSync.question("Nouvelle direction (gauche/droite) : ") as any;
                            } else {
                                direction = readlineSync.question("Nouvelle direction (haut-gauche / haut-droite / bas-gauche / bas-droite) : ") as any;
                            }
                        } else {
                            pionPeutCapturer = false;
                        }
                    } else {
                        console.log("Capture obligatoire ! Coup invalide.");
                        break;
                    }
                }
            } else {
                if (jeu.deplacerPion(x, y, direction, cases)) {
                    actionValide = true;
                } else {
                    console.log("Déplacement invalide !");
                }
            }
        }
        const adversaire = jeu.getJoueurActuel() === "N" ? "B" : "N";
        if (jeu.estPartieTerminee(adversaire)) {
            partieTerminee = true;
            console.log(`Partie terminée ! Le gagnant est ${jeu.getJoueurActuel()}`);
        } else {
            jeu.changerJoueur();
            console.log(`Joueur suivant : ${jeu.getJoueurActuel()}`);
        }
    }
}

jouerJeu();
