"use strict";
var boardsPiecesPositions = [[]];
var BoardPieceSideOrEmpty;
(function (BoardPieceSideOrEmpty) {
    BoardPieceSideOrEmpty[BoardPieceSideOrEmpty["black"] = 0] = "black";
    BoardPieceSideOrEmpty[BoardPieceSideOrEmpty["white"] = 1] = "white";
    BoardPieceSideOrEmpty[BoardPieceSideOrEmpty["emptySquare"] = 2] = "emptySquare";
})(BoardPieceSideOrEmpty || (BoardPieceSideOrEmpty = {}));
var BoardPieceType;
(function (BoardPieceType) {
    //Chess game  
    BoardPieceType[BoardPieceType["king"] = 0] = "king";
    BoardPieceType[BoardPieceType["queen"] = 1] = "queen";
    BoardPieceType[BoardPieceType["bishop"] = 2] = "bishop";
    BoardPieceType[BoardPieceType["knight"] = 3] = "knight";
    BoardPieceType[BoardPieceType["rook"] = 4] = "rook";
    BoardPieceType[BoardPieceType["pawn"] = 5] = "pawn";
    BoardPieceType[BoardPieceType["none"] = 6] = "none";
    //Add other games 
})(BoardPieceType || (BoardPieceType = {}));
class ChessGamePiece {
    constructor(boardPiecesSideOrEmpty = BoardPieceSideOrEmpty.emptySquare, boardPieceType = BoardPieceType.none, boardPiecePositionRow = 0, boardPiecePositionColumn = 0, currentBoardsPiecesPositions = [[]]) {
        this.checkIfMoveBelongingToThisPieceTypeCanBeDone = (stateOfTheBoardSquareWhereWeCanMove) => {
            if (stateOfTheBoardSquareWhereWeCanMove === this.boardPieceSideOrEmpty) { //We are checking if we clash with a piece of our own making this move in which case we cannot make it 
                return false; //If it is black and our current element is black... or white and our current element is white... these variables should be equal. Bear in mind we will never check empty with empty if anything it may be black or white with empty but never empty with empty or empty with black or white 
            }
            else { //Because we only run this code for pieces that have a black or white type assigned to the boardPieceType variable 
                return true;
            }
        };
        this.getResultingBoardPiecePositionsWithAGivenPossibleMove = (piecePositionAfterMoveRow, piecePositionAfterMoveColumn) => {
            var piecePositionBeforeMoveRow = this.boardPiecePositionRow;
            var piecePositionBeforeMoveColumn = this.boardPiecePositionColumn;
            var piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = JSON.parse(JSON.stringify(this.currentBoardPiecesPositions));
            piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[piecePositionBeforeMoveRow][piecePositionBeforeMoveColumn] = new ChessGamePiece(BoardPieceSideOrEmpty.emptySquare, BoardPieceType.none, piecePositionBeforeMoveRow, piecePositionBeforeMoveColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade);
            piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[piecePositionAfterMoveRow][piecePositionAfterMoveColumn] = new ChessGamePiece(this.boardPieceSideOrEmpty, this.boardPieceType, piecePositionAfterMoveRow, piecePositionAfterMoveColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade);
            return piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade;
        };
        this.piecesPositionsAfterPossibleMovesOnBoardWereMade = [[[]]]; //
        this.calculatePossibleMovesOnBoard = () => {
            var piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = [[]];
            switch (this.boardPieceType) {
                case BoardPieceType.king: {
                    if (this.checkIfMoveBelongingToThisPieceTypeCanBeDone(this.currentBoardPiecesPositions[this.boardPiecePositionRow][this.boardPiecePositionColumn + 1].boardPieceSideOrEmpty)) { // If we can move king one step to the right without stumbling upon a piece of its same color on the square we are moving to
                        piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = this.getResultingBoardPiecePositionsWithAGivenPossibleMove(this.boardPiecePositionRow, this.boardPiecePositionColumn + 1);
                        this.piecesPositionsAfterPossibleMovesOnBoardWereMade.push(piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade);
                    }
                    if (this.checkIfMoveBelongingToThisPieceTypeCanBeDone(this.currentBoardPiecesPositions[this.boardPiecePositionRow][this.boardPiecePositionColumn - 1].boardPieceSideOrEmpty)) { //// If we can move king one step to the left without stumbling upon a piece of its same color on the square we are moving to
                        piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = this.getResultingBoardPiecePositionsWithAGivenPossibleMove(this.boardPiecePositionRow, this.boardPiecePositionColumn - 1);
                        this.piecesPositionsAfterPossibleMovesOnBoardWereMade.push(piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade);
                    }
                    break;
                }
                default:
                    break;
            }
        }; //This function will give us new nodes for our tree and will fill the possibleMovesOnBoard array 
        this.boardPieceSideOrEmpty = boardPiecesSideOrEmpty;
        this.boardPieceType = boardPieceType;
        this.boardPiecePositionRow = boardPiecePositionRow;
        this.boardPiecePositionColumn = boardPiecePositionColumn;
        this.currentBoardPiecesPositions = currentBoardsPiecesPositions;
    }
}
class AlphaBetaPruningTreeNode {
    constructor() {
        this.alpha = -Infinity;
        this.beta = Infinity;
        this.currentBoardsPiecesPositions = [[]];
        this.boardsPiecesPositionsRepresentedByThisNode = [[]];
        this.depthAtWhichThisNodeFindsITself = 0; //We will 
        this.subtreeDepth = 5;
        this.parent = new AlphaBetaPruningTreeNode();
        this.children = [];
        this.evaluationFunction = () => { };
    }
}
