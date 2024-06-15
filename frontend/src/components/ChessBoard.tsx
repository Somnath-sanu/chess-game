/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Square, PieceSymbol, Color } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({
  board,
  socket,
  setBoard,
  chess,
  setChess,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket | null;
  setBoard: any;
  chess: any;
  setChess: any;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                "" +
                (8 - i)) as Square;
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation);
                    } else {
                      // setTo(square?.square ?? null);
                      socket?.send(
                        JSON.stringify({
                          type: MOVE,
                          move: {
                            from,
                            to: squareRepresentation,
                          },
                        })
                      );
                     
                     try {
                      chess.move({
                        from,
                        to: squareRepresentation,
                      });
                     } catch (error) {
                      console.log(error);
                      // setFrom(null);
                      
                     }
                      setBoard(chess.board());
                      // setChess(new chess(chess.fen()));
                      setFrom(null);
                    }

                    console.log({
                      from,
                      to: squareRepresentation,
                    });
                  }}
                  key={j}
                  className={`w-16 h-16 ${
                    (i + j) % 2 === 0
                      ? "bg-[rgb(115,148,83)]"
                      : "bg-[rgb(234,237,208)]"
                  }`}
                >
                  <div className="w-full flex justify-center items-center h-full">
                    <div className="flex flex-col justify-center h-full">
                      {square ? (
                        <img
                          src={`/${
                            square?.color === "b"
                              ? `b${square?.type.toLowerCase()}.png`
                              : `w${square?.type.toLowerCase()}.png`
                          }`}
                          alt=""
                        />
                      ) : null}
                    </div>
                    {/* {square ? square.type : ""} */}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
