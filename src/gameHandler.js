import { matches, userMatches } from './matches.js'
import { Chess } from 'chess.js'

export class ChessMatch {
    constructor(data) {
        data = JSON.parse(data);
        const white = data.users[Math.floor(Math.random() * data.users.length)];

        this.users = data.users;
        this.white = white;
        this.gameId = __generateID();

        this.chess = new Chess();

        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i] == white) continue
            this.black = data.users[i]
        }


        for (let i = 0; i < data.users.length; i++) {
            let ums = userMatches.get(data.users[i].tag);
            if (!ums) { userMatches.set(data.users[i].tag, []); ums = []; }

            let opponent = ''

            console.log(ums)
            for (let i2 = 0; i2 < data.users.length; i2++) {
                if (data.users[i2] == data.users[i]) continue;
                else opponent == data.users[i2];
            }

            ums.push([this.gameId, opponent]);

            userMatches.set(data.users[i].tag, ums);
        }
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