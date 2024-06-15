import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;

  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();

    this.startTime = new Date();

    //?Initialize players with their colors
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    //* validate the type of move using zod

    //?Check if it's White's turn and if the current player is not White
    if (this.board.history().length % 2 === 0 && socket != this.player1) {
      console.log("Sorry its white turn");
      
      return;
    }
    //? Check if it's Black's turn and if the current player is not Black
    if (this.board.history().length % 2 === 1 && socket != this.player2) {
      console.log("Sorry its black turn");
      return;
    }

    try {
      this.board.move(move);
    } catch (error) {
      console.log(error);
      return;
    }

    //? Check if the game is over
    if (this.board.isGameOver()) {
      //* send the game over message to both players
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    //?Send the move to the correct player

    if (this.board.moves().length % 2 === 0) {
      //* if (white player made a move)
      this.player2.send(
        JSON.stringify({
          //* let it  know to black player -> player2
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }

    //* Is it this users move

    //* Update the board

    //* push the move

    //* Check if the game is over

    //* Send the updated board to both players
  }
}

/**
 * ? If the remainder is 0 (this.board.moves.length % 2 === 0), it means the number of moves is even. This corresponds to White's turn in standard chess rules (assuming White always starts the game).
 * ?If the remainder is 1 (this.board.moves.length % 2 === 1), it means the number of moves is odd. This corresponds to Black's turn.
 */

/**
 * The method this.board.history() is used to get the move history, which correctly reflects the number of moves made so far. history() is a better choice over moves() as it provides a comprehensive history including captured pieces.
 */
