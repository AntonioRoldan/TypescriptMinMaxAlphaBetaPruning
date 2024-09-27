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
        this.boardPiecePositionIfMoveWereMadeRow = 0;
        this.boardPiecePositionIfMoveWereMadeColumn = 0;
        this.moveIsValid = (stateOfTheBoardSquareWhereWeCanMove) => {
            if (!this.checkIfMoveGoesBeyondTheEdgesOfTheBoard() && !this.checkIfMoveBelongingToThisPieceMakesPieceClashWithAPieceFromTheSameSide(stateOfTheBoardSquareWhereWeCanMove)) {
                return true;
            }
            else {
                return false;
            }
        };
        this.checkIfMoveBelongingToThisPieceMakesPieceClashWithAPieceFromTheSameSide = (stateOfTheBoardSquareWhereWeCanMove) => {
            if (stateOfTheBoardSquareWhereWeCanMove === this.boardPieceSideOrEmpty) { //We are checking if we clash with a piece of our own as we make this move in which case we cannot make it 
                return true; //If it is black and our current element is black... or white and our current element is white... (these variables equal only when there is a clash). Because we will never check empty with empty if anything it may be black or white with empty but never empty with empty or empty with black or white 
            }
            else { //Because we only run this code for pieces that have a black or white type assigned to the boardPieceType variable 
                return false;
            }
        };
        this.checkIfMoveGoesBeyondTheEdgesOfTheBoard = () => {
            if (this.boardPiecePositionIfMoveWereMadeRow > 7) { //If we cross the bottom board edge as we move downwards 
                return true;
            }
            else if (this.boardPiecePositionIfMoveWereMadeRow < 0) { //If we cross the top board edge as we move upwards
                return true;
            }
            else if (this.boardPiecePositionIfMoveWereMadeColumn > 7) { //If we cross the right board edge as we move to the right 
                return true;
            }
            else if (this.boardPiecePositionIfMoveWereMadeColumn < 0) { //If we cross the left board edge as we move to the left 
                return true;
            }
            else {
                return false;
            } //Note: The queen, knight and bishop could go beyond the edge diagonally through the corners but such case is covered too by these conditionals 
        };
        this.getResultingBoardPiecePositionsWithAGivenPossibleMove = () => {
            var piecePositionBeforeMoveRow = this.boardPiecePositionRow;
            var piecePositionBeforeMoveColumn = this.boardPiecePositionColumn;
            var piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = JSON.parse(JSON.stringify(this.currentBoardPiecesPositions));
            piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[piecePositionBeforeMoveRow][piecePositionBeforeMoveColumn] = new ChessGamePiece(BoardPieceSideOrEmpty.emptySquare, BoardPieceType.none, piecePositionBeforeMoveRow, piecePositionBeforeMoveColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade);
            piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[this.boardPiecePositionIfMoveWereMadeRow][this.boardPiecePositionIfMoveWereMadeColumn] = new ChessGamePiece(this.boardPieceSideOrEmpty, this.boardPieceType, this.boardPiecePositionIfMoveWereMadeRow, this.boardPiecePositionIfMoveWereMadeColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade);
            return piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade;
        };
        this.calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard = () => {
            var piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade = [[]];
            piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade = this.getResultingBoardPiecePositionsWithAGivenPossibleMove();
            this.piecesPositionsIfPossibleMovesOnBoardWereMade.push(piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade);
        };
        this.moveKing = () => {
            //TODO: Write this function 
            this.boardPiecePositionIfMoveWereMadeRow = this.boardPiecePositionRow + 1; //First we check for a one step move in a downwards direction
            this.boardPiecePositionIfMoveWereMadeColumn = this.boardPiecePositionColumn;
        };
        this.piecesPositionsIfPossibleMovesOnBoardWereMade = [[[]]]; //
        this.calculatePossibleMovesOnBoard = () => {
            var piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade = [[]];
            switch (this.boardPieceType) {
                case BoardPieceType.king: {
                    //If we can move the king one step downwards... 
                    if (this.moveIsValid(this.currentBoardPiecesPositions[this.boardPiecePositionRow + 1][this.boardPiecePositionColumn].boardPieceSideOrEmpty)) {
                        //Then store the combination of pieces positions on the board if we could make this move (Each combination is a different child to given parent node which is also a combination... and so the tree goes on)
                        this.calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard();
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
    constructor(parent) {
        this.alpha = -Infinity;
        this.beta = Infinity;
        this.currentBoardsPiecesPositions = [[]];
        this.boardsPiecesPositionsRepresentedByThisNode = [[]];
        this.depthAtWhichThisNodeFindsITself = 0; //We will 
        this.subtreeDepth = 5;
        this.children = [];
        this.calculateChildren = () => {
            //We will calculate possible moves from this point on by the adversary which will be represented as children nodes to this node 
            //We will do this by iterating through the board checking piece by piece of white type if it is the whites' turn or black type if it is the blacks' turn and calculating possible moves for that piece
            //using the piece's calculatePossibleMovesOnBoard method then we will check if the piecesPositionsAfterPossibleMovesOnBoardWereMade property 
            //for the IGameBoardPiece is empty if so we don't add children but if it is we add each one of its elements which are boards with the possible moves being made by this specific piece then 
            //the loop will continue on to the next piece 
        };
        this.evaluationFunction = () => { };
        this.parent = parent;
    }
}
