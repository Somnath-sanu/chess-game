import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

//Todo: Move together, there is code repetition here

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket: WebSocket | null = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("MESSAGE FROM WS :", message.payload);
      switch (message.type) {
        case INIT_GAME:
          console.log("Game initialized");
          setChess(new Chess());
          setBoard(chess.board());
          setStarted(true);
          break;

        case MOVE: {
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");
          break;
        }
        case GAME_OVER:
          console.log("Game over");
          setStarted(false); 
          break;
      }
    };
  }, [socket , chess]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
              setChess = {setChess}
            />
          </div>
          <div className="col-span-2 bg-[rgb(38,37,34)] w-full flex items-center justify-center">
            { !started && 
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                Play
              </Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

//? The error "Unexpected lexical declaration in case block" occurs because JavaScript's switch statement does not support block-scoped declarations (like const, let, or class) directly inside case clauses without additional braces {}.
