


var boardsPiecesPositions: IGameBoardPiece[][] = [[]]

enum BoardPieceSideOrEmpty{ //It represents the color of a given piece or whether it is an empty square which is a piece type we will use for empty squares on the board
    black,
    white,
    emptySquare
}

enum BoardPieceType {
    //Chess game  
    king,
    queen,
    bishop,
    knight,
    rook,
    pawn,
    none

    //Add other games 
}

interface IGameBoardPiece {
    boardPieceSideOrEmpty: BoardPieceSideOrEmpty
    boardPieceType: BoardPieceType 
    boardPiecePositionRow: number
    boardPiecePositionColumn: number
    currentBoardPiecesPositions: IGameBoardPiece [][]
    piecesPositionsAfterPossibleMovesOnBoardWereMade: IGameBoardPiece [][][]
    calculatePossibleMovesOnBoard: () => void
}

class ChessGamePiece implements IGameBoardPiece{
    boardPieceSideOrEmpty: BoardPieceSideOrEmpty
    boardPieceType: BoardPieceType
    boardPiecePositionRow: number
    boardPiecePositionColumn: number
    currentBoardPiecesPositions: IGameBoardPiece[][]
    checkIfMoveBelongingToThisPieceTypeCanBeDone = (stateOfTheBoardSquareWhereWeCanMove: BoardPieceSideOrEmpty) => {
        if(stateOfTheBoardSquareWhereWeCanMove === this.boardPieceSideOrEmpty) { //We are checking if we clash with a piece of our own making this move in which case we cannot make it 
            return false //If it is black and our current element is black... or white and our current element is white... these variables should be equal. Bear in mind we will never check empty with empty if anything it may be black or white with empty but never empty with empty or empty with black or white 
        } else { //Because we only run this code for pieces that have a black or white type assigned to the boardPieceType variable 
            return true 
        }
    }
    getResultingBoardPiecePositionsWithAGivenPossibleMove = (piecePositionAfterMoveRow: number, piecePositionAfterMoveColumn: number) => {
        var piecePositionBeforeMoveRow = this.boardPiecePositionRow
        var piecePositionBeforeMoveColumn = this.boardPiecePositionColumn
        var piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = JSON.parse(JSON.stringify(this.currentBoardPiecesPositions))
        piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[piecePositionBeforeMoveRow][piecePositionBeforeMoveColumn] = new ChessGamePiece(BoardPieceSideOrEmpty.emptySquare, BoardPieceType.none, piecePositionBeforeMoveRow, piecePositionBeforeMoveColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade)
        piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[piecePositionAfterMoveRow][piecePositionAfterMoveColumn] = new ChessGamePiece(this.boardPieceSideOrEmpty, this.boardPieceType, piecePositionAfterMoveRow, piecePositionAfterMoveColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade)
        return piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade
    }
    piecesPositionsAfterPossibleMovesOnBoardWereMade: IGameBoardPiece[][][] = [[[]]]//
    calculatePossibleMovesOnBoard = () => {
        var piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade: IGameBoardPiece [][] = [[]] 
        switch (this.boardPieceType){
            case BoardPieceType.king: {
                if(this.checkIfMoveBelongingToThisPieceTypeCanBeDone(this.currentBoardPiecesPositions[this.boardPiecePositionRow][this.boardPiecePositionColumn + 1].boardPieceSideOrEmpty)) {// If we can move king one step to the right without stumbling upon a piece of its same color on the square we are moving to
                    piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = this.getResultingBoardPiecePositionsWithAGivenPossibleMove(this.boardPiecePositionRow, this.boardPiecePositionColumn + 1)
                    this.piecesPositionsAfterPossibleMovesOnBoardWereMade.push(piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade)
                }
                if(this.checkIfMoveBelongingToThisPieceTypeCanBeDone(this.currentBoardPiecesPositions[this.boardPiecePositionRow][this.boardPiecePositionColumn - 1].boardPieceSideOrEmpty)) { //// If we can move king one step to the left without stumbling upon a piece of its same color on the square we are moving to
                    piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = this.getResultingBoardPiecePositionsWithAGivenPossibleMove(this.boardPiecePositionRow, this.boardPiecePositionColumn - 1)
                    this.piecesPositionsAfterPossibleMovesOnBoardWereMade.push(piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade)
                }
                break;
            } 
                
            
            default:
                break;
        }
    } //This function will give us new nodes for our tree and will fill the possibleMovesOnBoard array 
    constructor(boardPiecesSideOrEmpty = BoardPieceSideOrEmpty.emptySquare, boardPieceType = BoardPieceType.none, boardPiecePositionRow = 0, boardPiecePositionColumn = 0, currentBoardsPiecesPositions = [[]]) {
        this.boardPieceSideOrEmpty = boardPiecesSideOrEmpty
        this.boardPieceType = boardPieceType
        this.boardPiecePositionRow = boardPiecePositionRow
        this.boardPiecePositionColumn = boardPiecePositionColumn
        this.currentBoardPiecesPositions = currentBoardsPiecesPositions
    }
}
class AlphaBetaPruningTreeNode {
    alpha: number = -Infinity
    beta: number = Infinity
    currentBoardsPiecesPositions: IGameBoardPiece [][] = [[]]
    boardsPiecesPositionsRepresentedByThisNode: IGameBoardPiece[][] = [[]] 
    depthAtWhichThisNodeFindsITself: number = 0 //We will 
    subtreeDepth: number = 5 
    parent: AlphaBetaPruningTreeNode 
    children: AlphaBetaPruningTreeNode[] = []
    calculateChildren = () => {
        //We will calculate possible moves from this point on by the adversary which will be represented as children nodes to this node 
    }
    evaluationFunction = () => {}
    constructor(parent: AlphaBetaPruningTreeNode) {
        this.parent = parent
    }
}

