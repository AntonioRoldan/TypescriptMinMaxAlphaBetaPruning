"use strict";
// https://www.youtube.com/watch?v=_i-lZcbWkps video explaining the algorithm although here we have to add more features so it can apply to a proper chess game (for example we have to allow for a swap between the two opposing sides of a game with its respective change in turn for the player and computer )
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
class ChessGamePiecePossibleMovesForAGivenPieceCalculator {
    //This function will give us new nodes for our tree and will fill the possibleMovesOnBoard array 
    constructor(boardPiecesSideOrEmpty = BoardPieceSideOrEmpty.emptySquare, boardPieceType = BoardPieceType.none, boardPiecePositionRow = 0, boardPiecePositionColumn = 0, currentBoardsPiecesPositions = [[]], gameBoardPiece) {
        this.stateOfTheBoardSquareWhereWeCanMove = BoardPieceSideOrEmpty.emptySquare;
        this.boardPiecePositionIfMoveWereMadeRow = 0;
        this.boardPiecePositionIfMoveWereMadeColumn = 0;
        this.piecesPositionsIfAllPossibleMovesByEachPieceTypeOnBoardWereMade = [[[]]]; //An array storing one 2D array for each set of positions after each possible move is made by this piece 
        this.moveIsValid = () => {
            if (!this.checkIfMoveGoesBeyondTheEdgesOfTheBoard() && !this.checkIfMoveBelongingToThisPieceMakesPieceClashWithAPieceFromTheSameSide()) {
                return true;
            }
            else {
                return false;
            }
        };
        this.checkIfMoveBelongingToThisPieceMakesPieceClashWithAPieceFromTheSameSide = () => {
            if (this.stateOfTheBoardSquareWhereWeCanMove === this.boardPieceSideOrEmpty) { //We are checking if we clash with a piece of our own as we make this move in which case we cannot make it 
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
            piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[piecePositionBeforeMoveRow][piecePositionBeforeMoveColumn] = new ChessGamePiecePossibleMovesForAGivenPieceCalculator(BoardPieceSideOrEmpty.emptySquare, BoardPieceType.none, piecePositionBeforeMoveRow, piecePositionBeforeMoveColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade, this.gameBoardPiece); //We empty the square where the piece is now 
            piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[this.boardPiecePositionIfMoveWereMadeRow][this.boardPiecePositionIfMoveWereMadeColumn] = new ChessGamePiecePossibleMovesForAGivenPieceCalculator(this.boardPieceSideOrEmpty, this.boardPieceType, this.boardPiecePositionIfMoveWereMadeRow, this.boardPiecePositionIfMoveWereMadeColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade, this.gameBoardPiece); //And move the piece to the new position
            return piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade;
        };
        this.calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard = () => {
            //We are going to calculate possible moves AND store their resulting pieces' positions' combinations in the piecesPositionsIfPossibleMovesOnBoardWereMade array 
            //This array will take all the board position combinations resulting from possible moves and be used to add children to a given node in our alpha beta pruning tree 
            //It will also be stored in the piecesPositionsIfPossibleMovesOnBoardWereMade array as a 2D array representing board positions for each piece after a move is made 
            var piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade = [[]];
            piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade = this.getResultingBoardPiecePositionsWithAGivenPossibleMove();
            this.piecesPositionsIfAllPossibleMovesByEachPieceTypeOnBoardWereMade.push(piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade);
        };
        this.calculateSinglePossibleMove = (nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough) => {
            this.stateOfTheBoardSquareWhereWeCanMove = this.currentBoardPiecesPositions[this.boardPiecePositionRow + this.gameBoardPiece.arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition[nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].row][this.boardPiecePositionColumn + this.gameBoardPiece.arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition[nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].column].boardPieceSideOrEmpty; //We see if there are pieces on the square we can move to if so whether they are black or white. We are also checking if the square is empty
            if (this.moveIsValid()) { //Note these functions have no parameters because they are using the class properties we are setting right above this conditional statement 
                this.calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard();
            }
        };
        this.calculateBoardPiecesPositionsAfterEachPossibleMoveByThisPiece = () => {
            for (let nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough = 0; nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough < this.gameBoardPiece.arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition.length; nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough++) {
                this.calculateSinglePossibleMove(nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough);
            }
        };
        this.calculatePossibleMovesOnBoardByEachPieceFromTheSideWhoseTurnInTheGameItIs = () => {
            //We should calculate possible moves by all pieces on the board of a given turn's side 
            this.calculateBoardPiecesPositionsAfterEachPossibleMoveByThisPiece();
        };
        this.gameBoardPiece = gameBoardPiece;
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
