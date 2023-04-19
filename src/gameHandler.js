import { matches } from './matches.js'
import { Chess } from 'chess.js'

export class ChessMatch {
    constructor(data) {
        data = JSON.parse(data);
        
        this.users = data.users;
        this.white = data.users[Math.floor(Math.random() * data.users.length)];
        this.gameId = __generateID();

        this.chess = new Chess();
    }
}

let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234567890'
function __generateID() {
    let result = ''
    for (let i = 0; i < 6; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    result += "-"

    for (let i = 0; i < 6; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    result += "-"
    
    for (let i = 0; i < 6; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    result += "-"
    
    for (let i = 0; i < 6; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return result;
}