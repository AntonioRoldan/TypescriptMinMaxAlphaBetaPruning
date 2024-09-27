


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
    stateOfTheBoardSquareWhereWeCanMove: BoardPieceSideOrEmpty
    boardPiecePositionRow: number
    boardPiecePositionColumn: number
    boardPiecePositionIfMoveWereMadeRow: number
    boardPiecePositionIfMoveWereMadeColumn: number
    currentBoardPiecesPositions: IGameBoardPiece [][]
    piecesPositionsIfPossibleMovesOnBoardWereMade: IGameBoardPiece [][][]
    moveIsValid: () => boolean
    checkIfMoveGoesBeyondTheEdgesOfTheBoard: () => boolean
    calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard: () => void 
    calculatePossibleMovesOnBoard: () => void
}

class ChessGamePiece implements IGameBoardPiece{
    boardPieceSideOrEmpty: BoardPieceSideOrEmpty
    boardPieceType: BoardPieceType
    stateOfTheBoardSquareWhereWeCanMove: BoardPieceSideOrEmpty = BoardPieceSideOrEmpty.emptySquare
    boardPiecePositionIfMoveWereMadeRow: number = 0
    boardPiecePositionIfMoveWereMadeColumn: number = 0
    boardPiecePositionRow: number
    boardPiecePositionColumn: number
    currentBoardPiecesPositions: IGameBoardPiece[][]
    moveIsValid = () => {
        if(!this.checkIfMoveGoesBeyondTheEdgesOfTheBoard() && !this.checkIfMoveBelongingToThisPieceMakesPieceClashWithAPieceFromTheSameSide()) {
            return true 
        } else {
            return false 
        }
    }
    checkIfMoveBelongingToThisPieceMakesPieceClashWithAPieceFromTheSameSide = () => { //Parameter tells us if the square where we can move has a black piece, a white piece or is empty
        if(this.stateOfTheBoardSquareWhereWeCanMove === this.boardPieceSideOrEmpty) { //We are checking if we clash with a piece of our own as we make this move in which case we cannot make it 
            return true //If it is black and our current element is black... or white and our current element is white... (these variables equal only when there is a clash). Because we will never check empty with empty if anything it may be black or white with empty but never empty with empty or empty with black or white 
        } else { //Because we only run this code for pieces that have a black or white type assigned to the boardPieceType variable 
            return false 
        }
        
    }
    checkIfMoveGoesBeyondTheEdgesOfTheBoard = () : boolean  => { //We check if this possible move would go beyond any of the board's bottom top right or left edges 
        if(this.boardPiecePositionIfMoveWereMadeRow > 7){ //If we cross the bottom board edge as we move downwards 
            return true 
        } else if(this.boardPiecePositionIfMoveWereMadeRow < 0) { //If we cross the top board edge as we move upwards
            return true 
        } else if(this.boardPiecePositionIfMoveWereMadeColumn > 7){ //If we cross the right board edge as we move to the right 
            return true 
        } else if(this.boardPiecePositionIfMoveWereMadeColumn < 0){ //If we cross the left board edge as we move to the left 
            return true  
        } else {
            return false
        } //Note: The queen, knight and bishop could go beyond the edge diagonally through the corners but such case is covered too by these conditionals 
    }
    getResultingBoardPiecePositionsWithAGivenPossibleMove = () => {
        var piecePositionBeforeMoveRow = this.boardPiecePositionRow
        var piecePositionBeforeMoveColumn = this.boardPiecePositionColumn
        var piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = JSON.parse(JSON.stringify(this.currentBoardPiecesPositions))
        piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[piecePositionBeforeMoveRow][piecePositionBeforeMoveColumn] = new ChessGamePiece(BoardPieceSideOrEmpty.emptySquare, BoardPieceType.none, piecePositionBeforeMoveRow, piecePositionBeforeMoveColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade)
        piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade[this.boardPiecePositionIfMoveWereMadeRow][this.boardPiecePositionIfMoveWereMadeColumn] = new ChessGamePiece(this.boardPieceSideOrEmpty, this.boardPieceType, this.boardPiecePositionIfMoveWereMadeRow, this.boardPiecePositionIfMoveWereMadeColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade)
        return piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade
    }
    calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard = () => {
        var piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade: IGameBoardPiece [][] = [[]] 
        piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade = this.getResultingBoardPiecePositionsWithAGivenPossibleMove()
        this.piecesPositionsIfPossibleMovesOnBoardWereMade.push(piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade)

    }
    moveKing = () => {
        //TODO: Write this function 
        this.boardPiecePositionIfMoveWereMadeRow = this.boardPiecePositionRow + 1 //First we check for a one step move in a downwards direction
        this.boardPiecePositionIfMoveWereMadeColumn = this.boardPiecePositionColumn
        this.stateOfTheBoardSquareWhereWeCanMove = this.currentBoardPiecesPositions[this.boardPiecePositionRow + 1][this.boardPiecePositionColumn].boardPieceSideOrEmpty //We see if there are pieces on the square we can move to if so whether they are black or white. We are also checking if the square is empty
        if(this.moveIsValid()) {
            this.calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard
        }
    }
    piecesPositionsIfPossibleMovesOnBoardWereMade: IGameBoardPiece[][][] = [[[]]]//
    calculatePossibleMovesOnBoard = () => {
        var piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade: IGameBoardPiece [][] = [[]] 
        switch (this.boardPieceType){
            case BoardPieceType.king: {
                //If we can move the king one step downwards... 
                this.moveKing()
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
        //We will do this by iterating through the board checking piece by piece of white type if it is the whites' turn or black type if it is the blacks' turn and calculating possible moves for that piece
        //using the piece's calculatePossibleMovesOnBoard method then we will check if the piecesPositionsAfterPossibleMovesOnBoardWereMade property 
        //for the IGameBoardPiece is empty if so we don't add children but if it is we add each one of its elements which are boards with the possible moves being made by this specific piece then 
        //the loop will continue on to the next piece 
    }
    evaluationFunction = () => {}
    constructor(parent: AlphaBetaPruningTreeNode) {
        this.parent = parent
    }
}

