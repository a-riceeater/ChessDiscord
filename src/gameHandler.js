import { matches } from './matches.js'
import { Chess } from 'chess.js'

export class ChessMatch {
    constructor(data) {
        this.users = data.users;
        this.white = users[Math.floor(Math.random() * users.length)];
        this.gameId = "someRandomGameId" // generateID later

        this.chess = new Chess();
    }

}
