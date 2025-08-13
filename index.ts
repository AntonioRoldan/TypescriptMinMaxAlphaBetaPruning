
// https://www.youtube.com/watch?v=_i-lZcbWkps video explaining the algorithm although here we have to add more features so it can apply to a proper chess game (for example we have to allow for a swap between the two opposing sides of a game with its respective change in turn for the player and computer )

var boardsPiecesPositions: IGameBoardPossibleMovesForEachPieceCalculator[][] = [[]]

enum BoardPieceSideOrEmpty{ //It represents the color of a given piece in a given square or whether it is an empty square which is a piece type we will use for empty squares on the board
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


interface IGameBoardPossibleMovesForEachPieceCalculator {
    gameBoardPiece: IGameBoardPiece
    boardPieceSideOrEmpty: BoardPieceSideOrEmpty
    boardPieceType: BoardPieceType 
    opposingSidesBoardPieceColor: BoardPieceSideOrEmpty
    checkIfSpecialMoveAppliesIGameBoardPieceArgument: any
    checkIfSpecialMoveAppliesIGameBoardPieceArguments: {argument: any}[] //One argument for each piece type, we will iterate through this array and do one check in a single code block
    stateOfTheBoardSquareWhereWeCanMove: BoardPieceSideOrEmpty
    boardPiecePositionRow: number
    boardPiecePositionColumn: number
    boardPiecePositionIfMoveWereMadeRow: number
    boardPiecePositionIfMoveWereMadeColumn: number
    currentBoardPiecesPositions: IGameBoardPossibleMovesForEachPieceCalculator [][]
    piecesPositionsIfAllPossibleMovesByEachPieceTypeOnBoardWereMade: IGameBoardPossibleMovesForEachPieceCalculator [][][]
    moveIsValid: () => boolean
    checkIfMoveGoesBeyondTheEdgesOfTheBoard: () => boolean
    calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard: () => void 
    calculatePossibleMovesOnBoardByEachPieceFromTheSideWhoseTurnInTheGameItIs: () => void
}

interface IGameBoardPiece {
    arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition: {row: number, column: number}[] //Array of hashmaps, each hashmap has two keys, one for row and another for column. This array will store each possible move for this piece 
    specialMoves: {row: number, column: number}[] 
    checkIfSpecialMoveApplies: (arg: any) => boolean 
}

class King implements IGameBoardPiece {
    arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition: { row: number; column: number }[] = [{row: 1, column: 0}, {row:0, column:1}, {row: -1, column:0}, {row:0, column:-1}, {row: 1, column: 1}, {row:1, column: -1}, {row:-1, column: -1}, {row:-1, column:1}] //For moving without attacking 
    specialMoves: { row: number; column: number }[] = [] //For attacking a piece 
    checkIfSpecialMoveApplies: (arg: any) => boolean = () => { 
        return false 
    }
}

class Pawn implements IGameBoardPiece {
    arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition: { row: number; column: number }[] = [{row: 1, column: 0}]
    specialMoves: { row: number; column: number }[] = [{row: 1, column: 1}, {row:1, column: -1}]
    checkIfSpecialMoveApplies: (arg: any) => boolean = (isTargetRowAndColumnForThisMoveTakenByAnOpposingSidesPiece: boolean) => {
        return isTargetRowAndColumnForThisMoveTakenByAnOpposingSidesPiece
    }
}

class ChessGamePiecePossibleMovesForAGivenPieceCalculator implements IGameBoardPossibleMovesForEachPieceCalculator{
    gameBoardPiece: IGameBoardPiece 
    boardPieceSideOrEmpty: BoardPieceSideOrEmpty
    opposingSidesBoardPieceColor: BoardPieceSideOrEmpty
    boardPieceType: BoardPieceType
    checkIfSpecialMoveAppliesIGameBoardPieceArgument: any
    checkIfSpecialMoveAppliesIGameBoardPieceArguments: {boardPieceType: BoardPieceType, argument: any}[] = [{boardPieceType: BoardPieceType.pawn, argument: false}]//One argument for each piece type, we will iterate through this array and do one check in a single code block
    stateOfTheBoardSquareWhereWeCanMove: BoardPieceSideOrEmpty = BoardPieceSideOrEmpty.emptySquare
    boardPiecePositionIfMoveWereMadeRow: number = 0
    boardPiecePositionIfMoveWereMadeColumn: number = 0
    boardPiecePositionRow: number
    boardPiecePositionColumn: number
    currentBoardPiecesPositions: IGameBoardPossibleMovesForEachPieceCalculator[][] 
    piecesPositionsIfAllPossibleMovesByEachPieceTypeOnBoardWereMade: IGameBoardPossibleMovesForEachPieceCalculator[][][] = [[[]]]//An array storing one 2D array for each set of positions after each possible move is made by this piece 

    moveIsValid = () => {
        if(!this.checkIfMoveGoesBeyondTheEdgesOfTheBoard() && !this.checkIfMoveBelongingToThisPieceMakesPieceClashWithAnotherPiece()) {
            return true 
        } else {
            return false 
        }
    }
    checkIfMoveBelongingToThisPieceMakesPieceClashWithAnotherPiece = () => { //Parameter tells us if the square where we can move has a black piece, a white piece or is empty
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
        piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = new ChessGamePiecePossibleMovesForAGivenPieceCalculator(BoardPieceSideOrEmpty.emptySquare, BoardPieceSideOrEmpty.emptySquare, BoardPieceType.none, piecePositionBeforeMoveRow, piecePositionBeforeMoveColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade, this.gameBoardPiece) //We empty the square where the piece is now 
        piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade = new ChessGamePiecePossibleMovesForAGivenPieceCalculator(this.boardPieceSideOrEmpty, this.opposingSidesBoardPieceColor, this.boardPieceType, this.boardPiecePositionIfMoveWereMadeRow, this.boardPiecePositionIfMoveWereMadeColumn, piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade, this.gameBoardPiece) //And move the piece to the new position, note how we pass the board from the exact previous line since our new board will have the current row and column for this piece empty because we are making a move thus changing pieces' position, the boardPiecePositionIfMoveWereMade arguments for both row and column that we are passing (note they are two arguments) represent the piece move along with the piece type 
        return piecesPositionsOnBoardAfterAPossibleCalculatedMoveWereMade
    }
    calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard = () => {
         //We are going to calculate possible moves AND store their resulting pieces' positions' combinations in the piecesPositionsIfPossibleMovesOnBoardWereMade array 
        //This array will take all the board position combinations resulting from possible moves and be used to add children to a given node in our alpha beta pruning tree 
        //It will also be stored in the piecesPositionsIfPossibleMovesOnBoardWereMade array as a 2D array representing board positions for each piece after a move is made 
        var piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade: IGameBoardPossibleMovesForEachPieceCalculator [][] = [[]] 
        piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade = this.getResultingBoardPiecePositionsWithAGivenPossibleMove()
        this.piecesPositionsIfAllPossibleMovesByEachPieceTypeOnBoardWereMade.push(piecesPositionsOnBoardIfAPossibleCalculatedMoveWereMade) 

    }
    calculateSinglePossibleMove = (nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough: number) => { // This parameter is the gameBoardPiece array storing possible moves for a the gameBoardPiece as hashmaps of the amount of rows and columns it goes through from a starting position for a given move 

        this.stateOfTheBoardSquareWhereWeCanMove = this.currentBoardPiecesPositions[this.boardPiecePositionRow + this.gameBoardPiece.arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition[nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].row][this.boardPiecePositionColumn + this.gameBoardPiece.arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition[nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].column].boardPieceSideOrEmpty //We see if there are pieces on the square we can move to if so whether they are black or white. We are also checking if the square is empty
        this.boardPiecePositionIfMoveWereMadeRow = this.boardPiecePositionRow + this.gameBoardPiece.arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition[nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].row 
        this.boardPiecePositionIfMoveWereMadeColumn = this.boardPiecePositionColumn + this.gameBoardPiece.arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition[nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].column
        if(this.moveIsValid()) { //Note these functions have no parameters because they are using the class properties we are setting right above this conditional statement 
            
            this.calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard()
        }
    }
    checkIfSingleSpecialMoveAppliesDependingOnPieceType = () => {
        for(let pieceTypeIndexInCheckIfSpecialMoveAppliesIGameBoardPieceArguments = 0; pieceTypeIndexInCheckIfSpecialMoveAppliesIGameBoardPieceArguments < this.checkIfSpecialMoveAppliesIGameBoardPieceArguments.length; pieceTypeIndexInCheckIfSpecialMoveAppliesIGameBoardPieceArguments++){
            if(this.boardPieceType === this.checkIfSpecialMoveAppliesIGameBoardPieceArguments[pieceTypeIndexInCheckIfSpecialMoveAppliesIGameBoardPieceArguments].boardPieceType){
                this.checkIfSpecialMoveAppliesIGameBoardPieceArgument = this.checkIfSpecialMoveAppliesIGameBoardPieceArguments[pieceTypeIndexInCheckIfSpecialMoveAppliesIGameBoardPieceArguments].argument
            }
        }
        return this.gameBoardPiece.checkIfSpecialMoveApplies(this.checkIfSpecialMoveAppliesIGameBoardPieceArgument)
    }
    calculateSingleSpecialPossibleMove = (nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough: number) => {
        this.stateOfTheBoardSquareWhereWeCanMove = this.currentBoardPiecesPositions[this.boardPiecePositionRow + this.gameBoardPiece.specialMoves[nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].row][this.boardPiecePositionColumn + this.gameBoardPiece.specialMoves[nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].column].boardPieceSideOrEmpty //We see if there are pieces on the square we can move to if so whether they are black or white. We are also checking if the square is empty
        this.boardPiecePositionIfMoveWereMadeRow = this.boardPiecePositionRow + this.gameBoardPiece.specialMoves[nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].row
        this.boardPiecePositionIfMoveWereMadeColumn = this.boardPiecePositionColumn+ this.gameBoardPiece.specialMoves[nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough].column
        if(this.checkIfSingleSpecialMoveAppliesDependingOnPieceType()){
            this.calculateSinglePossibleMoveOnBoardAndStoreItsResultingPiecesPositionsCombinationsOnBoard()
        }
    }
    calculateBoardPiecesPositionsAfterEachPossibleMoveByThisPiece = () => {
        //First we calculate possible moves 
        for(let nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough = 0; nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough < this.gameBoardPiece.arrayOfCharacteristicMovesAsHashMapsInTermsOfRowAndColumnDifferenceWithRegardsToCurrentPiecePosition.length; nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough++){
            this.calculateSinglePossibleMove(nthPossibleMoveInTermsAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough)
        }
        //Next special moves, for example the pawn moves diagonally one step when attacking an opponent's piece 
        for(let nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough = 0; nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough < this.gameBoardPiece.specialMoves.length; nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough++)
            this.calculateSingleSpecialPossibleMove(nthPossibleSpecialMoveInTermsOfAmountOfColumnsAndRowsThePieceFromAStartingRowColumnPositionMovesThrough)
        }
    calculatePossibleMovesOnBoardByEachPieceFromTheSideWhoseTurnInTheGameItIs = () => {
        //We should calculate possible moves by all pieces on the board of a given turn's side 
        for(let pieceIndexOnBoard = 0; pieceIndexOnBoard < this.currentBoardPiecesPositions.length; pieceIndexOnBoard++){
            this.calculateBoardPiecesPositionsAfterEachPossibleMoveByThisPiece()            
        }
    }
    //This function will give us new nodes for our tree and will fill the possibleMovesOnBoard array 
    constructor(boardPiecesSideOrEmpty = BoardPieceSideOrEmpty.emptySquare, opposingSidesBoardPieceColor = BoardPieceSideOrEmpty.emptySquare,
        boardPieceType = BoardPieceType.none, boardPiecePositionRow = 0, boardPiecePositionColumn = 0, currentBoardsPiecesPositions = [[]], gameBoardPiece: IGameBoardPiece) {
        this.gameBoardPiece = gameBoardPiece
        this.boardPieceSideOrEmpty = boardPiecesSideOrEmpty
        this.opposingSidesBoardPieceColor = opposingSidesBoardPieceColor
        this.checkIfSpecialMoveAppliesIGameBoardPieceArguments = [{boardPieceType: BoardPieceType.pawn, argument: this.stateOfTheBoardSquareWhereWeCanMove === this.opposingSidesBoardPieceColor}]//One argument for each piece type, we will iterate through this array and do one check in a single code block
        this.boardPieceType = boardPieceType
        this.boardPiecePositionRow = boardPiecePositionRow
        this.boardPiecePositionColumn = boardPiecePositionColumn
        this.currentBoardPiecesPositions = currentBoardsPiecesPositions
    }
}
class AlphaBetaPruningTreeNode {
    alpha: number = -Infinity
    beta: number = Infinity
    currentBoardsPiecesPositions: IGameBoardPossibleMovesForEachPieceCalculator [][] = [[]]
    boardsPiecesPositionsRepresentedByThisNode: IGameBoardPossibleMovesForEachPieceCalculator[][] = [[]] 
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

