


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
    pawn

    //Add other games 
}

interface IGameBoardPiece {
    boardPieceSideOrEmpty: BoardPieceSideOrEmpty
    boardPieceType: BoardPieceType 
    boardPiecePositionRow: number
    boardPiecePositionColumn: number
    currentBoardPiecesPositions: IGameBoardPiece [][]
    possibleMovesOnBoard: IGameBoardPiece [][][]
    calculateMovesOnBoard: () => {}
}

class ChessGamePiece implements IGameBoardPiece{
    boardPieceSideOrEmpty: BoardPieceSideOrEmpty
    boardPieceType: BoardPieceType
    boardPiecePositionRow: number
    boardPiecePositionColumn: number
    currentBoardPiecesPositions: IGameBoardPiece[][]
    checkIfMoveBelongingToThisPieceTypeCanBeDone = (stateOfTheBoardSquareWhereWeCanMove: BoardPieceSideOrEmpty) => {
        if(stateOfTheBoardSquareWhereWeCanMove === this.boardPieceSideOrEmpty) { //We are checking if we clash with a piece of our own making this move in which case we cannot make it 
            return false 
        } else {
            return true 
        }
    }
    piecesPositionsAfterPossibleMovesOnBoard: IGameBoardPiece[][][] //
    calculatePossibleMovesOnBoard = () => {
        var piecesPositionsOnBoardAfterThisMoveIsMade: IGameBoardPiece [][] = JSON.parse(JSON.stringify(this.currentBoardPiecesPositions)) // We make a copy of current board which we can modify for it to be added to piecesPositionsAfterPossibleMovesOnBoard  
        switch (this.boardPieceType){
            case BoardPieceType.king: {
                if(this.checkIfMoveBelongingToThisPieceTypeCanBeDone(this.currentBoardPiecesPositions[this.boardPiecePositionRow][this.boardPiecePositionColumn + 1].boardPieceSideOrEmpty)) {// If we can move to the right 
                    this.piecesPositionsAfterPossibleMovesOnBoard.push()
                }
                break;
            } 
                
            
            default:
                break;
        }
    } //This function will give us new nodes for our tree and will fill the possibleMovesOnBoard array 
    constructor(boardPiecesSideOrEmpty = BoardPieceSideOrEmpty.emptySquare, boardPieceType = BoardPieceType.pawn, boardPiecePositionRow = 0, boardPiecePositionColumn = 0, currentBoardsPiecesPositions = [[]]) {
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
    parent: AlphaBetaPruningTreeNode = new AlphaBetaPruningTreeNode()
    children: AlphaBetaPruningTreeNode[] = []
    evaluationFunction = () => {}
}

