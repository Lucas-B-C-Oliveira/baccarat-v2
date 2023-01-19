import { match } from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import { BallBeadPlate, BallBigRoad, Balls, BigEyeBoyBall, BigRoadBallImage, CockroachPigBall, CurrentScore, MatchData, MESSAGE_FOR_MAKE_INITIAL_STATE_OF_THE_GAME, SocketEvents } from "../../utils/globalTypesEnumsAndInterfaces";
import { BarOfBallOfTheBigRoad, SmallRoadBall } from './../../utils/globalTypesEnumsAndInterfaces';


let currentMatch: number = 0

const Y_AND_X_POSITION_MULTIPLIER_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS = 36
const X_START_POSITION_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS = 23

/// ### Bead Plate Variables

let currentColumnOfBeadPlate: number = 0
let currentRowOfBeadPlate: number = 0
let isItToCleanTheBeadPlate: boolean = false

const Y_START_POSITION_FOR_BEAD_PLATE_BALLS = 186
const COLUMN_LIMIT_INDEX_TO_BEAD_PLATE = 21
const ROW_LIMIT_INDEX_TO_BEAD_PLATE = 6

/// Big Road Variables

const Y_START_POSITION_FOR_BIG_ROAD_BALLS = 410
const FREE_STARTING_ROW = 0
const ROW_LIMIT_INDEX_TO_BIG_ROAD = 4
const COLUMN_LIMIT_INDEX_TO_BIG_ROAD = 40

let currentRowOfBigRoad: number = 0
let currentColumnOfBigRoad: number = 0
let lastLockedRowForPutBallsOfTheBigRoad: number = ROW_LIMIT_INDEX_TO_BIG_ROAD
let lastLockedColumnForPutBallsOfTheBigRoad: number = 0
let columnThatStartedTheLongSequenceOfEqualsBalls: number = 0 //! TODO: Understand what this variable is for | and put a clearer and more specific name

let isItToCleanTheBigRoad: boolean = false
let needLockANewRow: boolean = false
let longSequenceOfEqualsBalls: boolean = false

let ballOfTheBigRoadFromPreviousPlay: BigRoadBallImage
let modifiedBallOfTheBigRoad: Balls = Balls.INVISIBLE //! TODO: Maybe we need to remove this variable

/// #### BARS 
let barOfBallOfTheBigRoad: BarOfBallOfTheBigRoad | undefined
let numberOfBarsGenerated: number = 0

const X_START_POSITION_FOR_BIG_ROAD_BARS = 11
const Y_START_POSITION_FOR_BIG_ROAD_BARS = 35
const Y_POSITION_MULTIPLIER_FOR_BIG_ROAD_BARS = 5
const MAXIMUM_BAR_LIMIT_ON_A_BALL = 7

/// Big Eye Boy Variables

const Y_START_POSITION_FOR_BIG_EYE_BOY_BALLS = 598
const X_START_POSITION_FOR_BIG_EYE_BOY_BALLS = 5
const X_POSITION_MULTIPLIER_FOR_BIG_EYE_BOY_BALLS = 18
const Y_POSITION_MULTIPLIER_FOR_BIG_EYE_BOY_BALLS = 18

const END_ROW_OF_BIG_EYE_BOY = 5
const END_COLUMN_OF_BIG_EYE_BOY = 80

let currentRowOfBigEyeBoy: number = 0
let currentColumnOfBigEyeBoy: number = 0
let lastBallOfBigEyeBoy: BigRoadBallImage = undefined

interface simplifiedBigRoadBallForTheBackEnd {
  row: number,
  column: number,
  image: BigRoadBallImage
}

let ballsInBigRoadTable = generateTable<simplifiedBigRoadBallForTheBackEnd>(5, 40)
let ballsInBigRoadTableInPlaysOrder: simplifiedBigRoadBallForTheBackEnd[] = []

/// Small Road Variables
const Y_START_POSITION_FOR_SMALL_ROAD_BALLS = 714
const X_START_POSITION_FOR_SMALL_ROAD_BALLS = 5
const X_POSITION_MULTIPLIER_FOR_SMALL_ROAD_BALLS = 18
const Y_POSITION_MULTIPLIER_FOR_SMALL_ROAD_BALLS = 18

const END_ROW_OF_SMALL_ROAD = 5
const END_COLUMN_OF_SMALL_ROAD = 40

let currentRowOfSmallRoad: number = 0
let currentColumnOfSmallRoad: number = 0
let lastBallOfSmallRoad: BigRoadBallImage = undefined

/// Cockroach Pig Variables
const Y_START_POSITION_FOR_COCKROACH_PIG_BALLS = 714
const X_START_POSITION_FOR_COCKROACH_PIG_BALLS = 725
const X_POSITION_MULTIPLIER_FOR_COCKROACH_PIG_BALLS = 18
const Y_POSITION_MULTIPLIER_FOR_COCKROACH_PIG_BALLS = 18

const END_ROW_OF_COCKROACH_PIG = 5
const END_COLUMN_OF_COCKROACH_PIG = 40

let currentRowOfCockroachPig: number = 0
let currentColumnOfCockroachPig: number = 0
let lastBallOfCockroachPig: BigRoadBallImage = undefined

/// # Current Score Results
let currentNumberOfPlays: number = 0
let currentNumberOfBankerWins: number = 0
let currentNumberOfPlayerWins: number = 0
let currentNumberOfTieWins: number = 0
let currentNumberOfNaturalWins: number = 0
let currentNumberOfMaxBet: number = 0
let currentNumberOfMinBet: number = 0
let currentNumberOfMaxTie: number = 0

/// # Last Score Results
let lastNumberOfPlays: number = 0
let lastNumberOfBankerWins: number = 0
let lastNumberOfPlayerWins: number = 0
let lastNumberOfTieWins: number = 0
let lastNumberOfNaturalWins: number = 0


function addBalls(newBall: Balls): MatchData {

  if (numberOfBarsGenerated >= MAXIMUM_BAR_LIMIT_ON_A_BALL && newBall === Balls.TIE_HANDS) return {}
  updateCurrentScore(newBall)

  const newBeadPlateBall = generateABallForTheBeadPlate(newBall)
  const newBigRoadData = generateABallOrBarForTheBigRoad(newBall)
  const currentScore = getCurrentScore()

  currentMatch++

  const newMatchData: MatchData = {
    newBeadPlateBall,
    newBigRoadBall: undefined,
    newBigRoadBar: undefined,
    newBigEyeBoyBall: undefined,
    newSmallRoadBall: undefined,
    isItToClean: {
      allBallsOnBeadPlate: isItToCleanTheBeadPlate,
      allBallsOnBigRoad: isItToCleanTheBigRoad
    },
    currentScore
  }

  if ("image" in newBigRoadData) {
    newMatchData.newBigRoadBall = newBigRoadData
    const { column, row, image } = newBigRoadData

    if (typeof column === 'number' && typeof row === 'number') {
      ballsInBigRoadTableInPlaysOrder.push({ column, row, image })
      ballsInBigRoadTable[column][row] = { column, row, image }
    }

    if ((ballsInBigRoadTable[1][0].image !== undefined && (ballsInBigRoadTable[1][1].image !== undefined || ballsInBigRoadTable[2][0].image !== undefined)) ||
      (ballsInBigRoadTable[1][ballsInBigRoadTable[1].length - 1].image !== undefined && (ballsInBigRoadTable[2][ballsInBigRoadTable[2].length - 1].image !== undefined || ballsInBigRoadTable[1][0].image !== undefined))
    ) {
      //* The first entry in the Big Eye Boy table is the hand after the first entry in the second column of the Big Road
      const newBigEyeBoyBall = generateABallForBigEyeBoy()
      newMatchData.newBigEyeBoyBall = newBigEyeBoyBall
    }


    if ((ballsInBigRoadTable[2][0].image !== undefined && (ballsInBigRoadTable[2][1].image !== undefined || ballsInBigRoadTable[3][0].image !== undefined)) ||
      (ballsInBigRoadTable[2][ballsInBigRoadTable[2].length - 1].image !== undefined && (ballsInBigRoadTable[3][ballsInBigRoadTable[3].length - 1].image !== undefined || ballsInBigRoadTable[2][0].image !== undefined))
    ) {
      //* Small Road must wait until the entry after the first entry in the third column of the Big Road
      const newSmallRoadBall = generateABallForSmallRoad()
      newMatchData.newSmallRoadBall = newSmallRoadBall
    }

    if ((ballsInBigRoadTable[3][0].image !== undefined && (ballsInBigRoadTable[3][1].image !== undefined || ballsInBigRoadTable[4][0].image !== undefined)) ||
      (ballsInBigRoadTable[3][ballsInBigRoadTable[3].length - 1].image !== undefined && (ballsInBigRoadTable[4][ballsInBigRoadTable[4].length - 1].image !== undefined || ballsInBigRoadTable[3][0].image !== undefined))
    ) {
      //* Cockroach Pig must wait until the entry after the first entry in the fourth column of the Big Road
      const newCockroachPigBall = generateABallForCockroachPig()
      newMatchData.newCockroachPigBall = newCockroachPigBall
    }
  }
  else {
    newMatchData.newBigRoadBar = newBigRoadData
  }

  return newMatchData
}

function generateABallForTheBeadPlate(newBall: Balls): BallBeadPlate {

  isItToCleanTheBeadPlate = false

  if (currentMatch % ROW_LIMIT_INDEX_TO_BEAD_PLATE === 0 && currentMatch !== 0) {
    currentColumnOfBeadPlate++
    currentRowOfBeadPlate = 0
  }

  if (currentColumnOfBeadPlate >= COLUMN_LIMIT_INDEX_TO_BEAD_PLATE) cleanTheBeadPlate()

  const { newYPosition, newXPosition } = generateANewPositionToBalls(currentRowOfBeadPlate, currentColumnOfBeadPlate, Y_START_POSITION_FOR_BEAD_PLATE_BALLS, X_START_POSITION_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS, Y_AND_X_POSITION_MULTIPLIER_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS, Y_AND_X_POSITION_MULTIPLIER_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS)

  currentRowOfBeadPlate++

  return {
    key: "" + Math.random() * Math.random() * Math.random() + currentMatch, //! TODO: use lib for make key
    position: { x: newXPosition, y: newYPosition },
    image: newBall,
  }
}

function generateABallOrBarForTheBigRoad(newBall: Balls): BallBigRoad | BarOfBallOfTheBigRoad {
  isItToCleanTheBigRoad = false

  if (newBall === Balls.TIE_HANDS) {

    if (currentNumberOfPlays !== 0) {
      /// I have to return only one Bar to add to previous ball in Front-End
      return generateANewBarToBallOfTheBigRoad()
    }
    else {
      /// I have to return only one ball with invisible image and a bar inside
      barOfBallOfTheBigRoad = generateANewBarToBallOfTheBigRoad()
    }

  }
  else if (currentNumberOfPlays !== 0) numberOfBarsGenerated = 0

  modifiedBallOfTheBigRoad = generateANewModifiedBallOfTheBigRoad(newBall)

  if (ballOfTheBigRoadFromPreviousPlay === modifiedBallOfTheBigRoad) {
    /// # I have to put one ball under the other, in the next row

    const IsTheCurrentColumnPastTheColumnLimit = currentColumnOfBigRoad > lastLockedColumnForPutBallsOfTheBigRoad
    lastLockedRowForPutBallsOfTheBigRoad = IsTheCurrentColumnPastTheColumnLimit ? ROW_LIMIT_INDEX_TO_BIG_ROAD : lastLockedRowForPutBallsOfTheBigRoad

    if (currentRowOfBigRoad === lastLockedRowForPutBallsOfTheBigRoad) {

      /// ### I have to put the ball in the next column to the RIGHT, as the below is blocked, and I have to block the current column,
      /// ### and warn that i will have to block a new line

      currentColumnOfBigRoad++
      lastLockedColumnForPutBallsOfTheBigRoad = currentColumnOfBigRoad
      needLockANewRow = true
    }
    else {
      /// # I have to put one ball under the other, in the next row

      currentRowOfBigRoad++
      columnThatStartedTheLongSequenceOfEqualsBalls = currentColumnOfBigRoad /// # For the next play
      longSequenceOfEqualsBalls = true /// # For the next play
    }

  }
  else {
    /// I have to put a ball in the next Column on the Right

    currentRowOfBigRoad = FREE_STARTING_ROW

    if (longSequenceOfEqualsBalls) {
      /// To continue with the column where the sequence of equals balls started
      currentColumnOfBigRoad = columnThatStartedTheLongSequenceOfEqualsBalls
      longSequenceOfEqualsBalls = false
    }

    if (needLockANewRow) {
      /// When the ball reaches the last row of the table and goes to another column, it is necessary to block the last row
      lastLockedRowForPutBallsOfTheBigRoad--
      needLockANewRow = false
    }
    currentColumnOfBigRoad = currentMatch === 0 ? 0 : (currentColumnOfBigRoad + 1)
  }

  if (currentColumnOfBigRoad >= COLUMN_LIMIT_INDEX_TO_BIG_ROAD) {
    /// Clear Big Road table, because game has reched the limit of Big Road table
    cleanTheBigRoad(modifiedBallOfTheBigRoad)
  }


  const { newYPosition, newXPosition } = generateANewPositionToBalls(currentRowOfBigRoad, currentColumnOfBigRoad, Y_START_POSITION_FOR_BIG_ROAD_BALLS, X_START_POSITION_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS, Y_AND_X_POSITION_MULTIPLIER_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS, Y_AND_X_POSITION_MULTIPLIER_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS)

  ballOfTheBigRoadFromPreviousPlay = modifiedBallOfTheBigRoad

  return {
    key: "" + Math.random() * Math.random() * Math.random() + currentMatch, //! TODO: use lib for make key
    position: { x: newXPosition, y: newYPosition },
    image: modifiedBallOfTheBigRoad,
    bars:
      currentNumberOfPlays === 0 &&
        newBall === Balls.TIE_HANDS && barOfBallOfTheBigRoad
        ? [barOfBallOfTheBigRoad]
        : [],
    column: currentColumnOfBigRoad,
    row: currentRowOfBigRoad,
  }

}

function generateABallForBigEyeBoy(): BigEyeBoyBall {

  const lastBall = ballsInBigRoadTableInPlaysOrder[ballsInBigRoadTableInPlaysOrder.length - 1]
  const penultimateBall = ballsInBigRoadTableInPlaysOrder[ballsInBigRoadTableInPlaysOrder.length - 2]

  let bigEyeBoyBallImage: BigRoadBallImage = undefined

  if (lastBall.column > penultimateBall.column) {

    const penultimateFilledColumn = lastBall.column - 1
    const antepenultimateFilledColumn = lastBall.column - 2
    const numberOfRowsInPenultimateFilledColumn = ballsInBigRoadTable[penultimateFilledColumn].filter(ball => ball.image).length
    const numberOfRowsInAntepenultimateFilledColumn = ballsInBigRoadTable[antepenultimateFilledColumn].filter(ball => ball.image).length

    if (numberOfRowsInPenultimateFilledColumn === numberOfRowsInAntepenultimateFilledColumn) bigEyeBoyBallImage = Balls.BANKER /// Return a Red Ball
    else bigEyeBoyBallImage = Balls.PLAYER /// Return a blue ball

  }
  else {
    const columnToTheLeftOfTheLastBall = lastBall.column - 1
    const rowAboveTheRowOfTheLastBall = lastBall.row - 1
    const cellToTheLeftOfTheLastBall = ballsInBigRoadTable[columnToTheLeftOfTheLastBall][lastBall.row].image
    const cellAboveTheCellToTheLeftOfTheLastBall = ballsInBigRoadTable[columnToTheLeftOfTheLastBall][rowAboveTheRowOfTheLastBall].image

    if (cellToTheLeftOfTheLastBall === cellAboveTheCellToTheLeftOfTheLastBall) bigEyeBoyBallImage = Balls.BANKER /// Return a Red Ball
    else bigEyeBoyBallImage = Balls.PLAYER /// Return a Blue Ball

  }

  const { newRow, newColumn } = updateColumnAndRows(lastBallOfBigEyeBoy, bigEyeBoyBallImage, currentRowOfBigEyeBoy,
    currentColumnOfBigEyeBoy, END_ROW_OF_BIG_EYE_BOY, END_COLUMN_OF_BIG_EYE_BOY)
  const { newYPosition, newXPosition } = generateANewPositionToBalls(newRow, newColumn, Y_START_POSITION_FOR_BIG_EYE_BOY_BALLS, X_START_POSITION_FOR_BIG_EYE_BOY_BALLS, X_POSITION_MULTIPLIER_FOR_BIG_EYE_BOY_BALLS, Y_POSITION_MULTIPLIER_FOR_BIG_EYE_BOY_BALLS)
  lastBallOfBigEyeBoy = bigEyeBoyBallImage

  currentRowOfBigEyeBoy = newRow
  currentColumnOfBigEyeBoy = newColumn

  return {
    key: "" + Math.random() * Math.random() * Math.random() + currentMatch, //! TODO: use lib for make key,
    image: bigEyeBoyBallImage,
    position: { x: newXPosition, y: newYPosition }
  }

}

function generateABallForSmallRoad(): SmallRoadBall {

  const lastBall = ballsInBigRoadTableInPlaysOrder[ballsInBigRoadTableInPlaysOrder.length - 1]
  const penultimateBall = ballsInBigRoadTableInPlaysOrder[ballsInBigRoadTableInPlaysOrder.length - 2]

  let smallRoadBallImage: BigRoadBallImage = undefined

  if (lastBall.column > penultimateBall.column) {
    const firstColumnToTheLeftOfTheLastBallOnBigRoad = lastBall.column - 1
    const thirdColumnToTheLeftOfTheLastBallOnBigRoad = lastBall.column - 3

    const numberOfRowsInFirstColumnToTheLeftOfTheLastBallOnBigRoad = ballsInBigRoadTable[firstColumnToTheLeftOfTheLastBallOnBigRoad].filter(ball => ball.image).length
    const numberOfRowsInThirdColumnToTheLeftOfTheLastBallOnBigRoad = ballsInBigRoadTable[thirdColumnToTheLeftOfTheLastBallOnBigRoad].filter(ball => ball.image).length

    if (numberOfRowsInFirstColumnToTheLeftOfTheLastBallOnBigRoad === numberOfRowsInThirdColumnToTheLeftOfTheLastBallOnBigRoad) smallRoadBallImage = Balls.BANKER /// Return a Red Ball
    else smallRoadBallImage = Balls.PLAYER /// Return a Blue Ball

  }
  else {
    const twoColumnsToTheLeftOfTheLastBall = lastBall.column - 2
    const rowAboveRowOfTheLastBall = lastBall.row - 1

    const cellTwoColumnsToTheLeftOfTheLastBall = ballsInBigRoadTable[twoColumnsToTheLeftOfTheLastBall][lastBall.row].image
    const cellTwoColumnsToTheLeftAndOneRowAboveTheLastBall = ballsInBigRoadTable[twoColumnsToTheLeftOfTheLastBall][rowAboveRowOfTheLastBall].image

    if (cellTwoColumnsToTheLeftOfTheLastBall === cellTwoColumnsToTheLeftAndOneRowAboveTheLastBall) smallRoadBallImage = Balls.BANKER /// Return a Red Ball
    else smallRoadBallImage = Balls.PLAYER /// Return a Blue Ball
  }

  const { newRow, newColumn } = updateColumnAndRows(lastBallOfSmallRoad, smallRoadBallImage, currentRowOfSmallRoad,
    currentColumnOfSmallRoad, END_ROW_OF_SMALL_ROAD, END_COLUMN_OF_SMALL_ROAD)
  const { newYPosition, newXPosition } = generateANewPositionToBalls(newRow, newColumn,
    Y_START_POSITION_FOR_SMALL_ROAD_BALLS,
    X_START_POSITION_FOR_SMALL_ROAD_BALLS,
    X_POSITION_MULTIPLIER_FOR_SMALL_ROAD_BALLS,
    Y_POSITION_MULTIPLIER_FOR_SMALL_ROAD_BALLS)
  lastBallOfSmallRoad = smallRoadBallImage

  currentRowOfSmallRoad = newRow
  currentColumnOfSmallRoad = newColumn

  return {
    key: "" + Math.random() * Math.random() * Math.random() + currentMatch, //! TODO: use lib for make key,
    image: smallRoadBallImage,
    position: { x: newXPosition, y: newYPosition }
  }

}

function generateABallForCockroachPig(): CockroachPigBall {

  const lastBall = ballsInBigRoadTableInPlaysOrder[ballsInBigRoadTableInPlaysOrder.length - 1]
  const penultimateBall = ballsInBigRoadTableInPlaysOrder[ballsInBigRoadTableInPlaysOrder.length - 2]

  let CockroachPigBallImage: BigRoadBallImage = undefined

  if (lastBall.column > penultimateBall.column) {
    const firstColumnToTheLeftOfTheLastBallOnBigRoad = lastBall.column - 1
    const fourthColumnToTheLeftOfTheLastBallOnBigRoad = lastBall.column - 4

    const numberOfRowsInFirstColumnToTheLeftOfTheLastBallOnBigRoad = ballsInBigRoadTable[firstColumnToTheLeftOfTheLastBallOnBigRoad].filter(ball => ball.image).length
    const numberOfRowsInFourthColumnToTheLeftOfTheLastBallOnBigRoad = ballsInBigRoadTable[fourthColumnToTheLeftOfTheLastBallOnBigRoad].filter(ball => ball.image).length

    if (numberOfRowsInFirstColumnToTheLeftOfTheLastBallOnBigRoad === numberOfRowsInFourthColumnToTheLeftOfTheLastBallOnBigRoad) CockroachPigBallImage = Balls.BANKER /// Return a Red Ball
    else CockroachPigBallImage = Balls.PLAYER /// Return a Blue Ball

  }
  else {
    const threeColumnsToTheLeftOfTheLastBall = lastBall.column - 3
    const rowAboveRowOfTheLastBall = lastBall.row - 1

    const cellThreeColumnsToTheLeftOfTheLastBall = ballsInBigRoadTable[threeColumnsToTheLeftOfTheLastBall][lastBall.column]?.image
    const cellThreeColumnsToTheLeftAndOneRowAboveTheLastBall = ballsInBigRoadTable[threeColumnsToTheLeftOfTheLastBall][rowAboveRowOfTheLastBall]?.image

    if (cellThreeColumnsToTheLeftOfTheLastBall === cellThreeColumnsToTheLeftAndOneRowAboveTheLastBall) CockroachPigBallImage = Balls.BANKER /// Return a Red Ball
    else CockroachPigBallImage = Balls.PLAYER /// Return a Blue Ball
  }

  const { newRow, newColumn } = updateColumnAndRows(lastBallOfCockroachPig, CockroachPigBallImage, currentRowOfCockroachPig,
    currentColumnOfCockroachPig, END_ROW_OF_COCKROACH_PIG, END_COLUMN_OF_COCKROACH_PIG)
  const { newYPosition, newXPosition } = generateANewPositionToBalls(newRow, newColumn,
    Y_START_POSITION_FOR_COCKROACH_PIG_BALLS,
    X_START_POSITION_FOR_COCKROACH_PIG_BALLS,
    X_POSITION_MULTIPLIER_FOR_COCKROACH_PIG_BALLS,
    Y_POSITION_MULTIPLIER_FOR_COCKROACH_PIG_BALLS)
  lastBallOfCockroachPig = CockroachPigBallImage

  currentRowOfCockroachPig = newRow
  currentColumnOfCockroachPig = newColumn

  return {
    key: "" + Math.random() * Math.random() * Math.random() + currentMatch, //! TODO: use lib for make key,
    image: CockroachPigBallImage,
    position: { x: newXPosition, y: newYPosition }
  }

}

function updateColumnAndRows(lastBall: Balls | undefined, currentBall: Balls | undefined, row: number, column: number, endRow: number, EndColumn: number, initialRow: number = 0, initialColumn: number = 0) {

  let newRow: number = row
  let newColumn: number = column


  if (lastBall === currentBall) {
    //! TODO: Precisa terminar isso aqui
    if (newRow >= endRow) { newRow = initialRow }
    else newRow++

  }
  else {

    if (newColumn >= EndColumn) { newColumn = initialColumn }
    else {
      newColumn++
      newRow = initialRow /// Tenho que voltar pra última coluna liberada
    }
  }

  return {
    newRow,
    newColumn
  }
}

function generateTable<Balls>(rows: number, columns: number): Balls[][] {

  const table: any[][] = []

  for (let col = 0; col < columns; col++) {
    table.push([])

    for (let row = 0; row < rows; row++) {
      table[col].push({})

    }
  }
  return table
}

function generateANewModifiedBallOfTheBigRoad(modifiedBallOfTheBigRoad: Balls): Balls.PLAYER | Balls.BANKER | Balls.INVISIBLE {
  const checkIfBallIsSomePlayer = (modifiedBallOfTheBigRoad === Balls.PLAYER_8 || modifiedBallOfTheBigRoad === Balls.PLAYER_9 || modifiedBallOfTheBigRoad === Balls.PLAYER)
  const checkIfBallIsSomeBanker = (modifiedBallOfTheBigRoad === Balls.BANKER_8 || modifiedBallOfTheBigRoad === Balls.BANKER_9 || modifiedBallOfTheBigRoad === Balls.BANKER)

  if (checkIfBallIsSomePlayer) return Balls.PLAYER
  else if (checkIfBallIsSomeBanker) return Balls.BANKER
  else if (modifiedBallOfTheBigRoad === Balls.TIE_HANDS) return Balls.INVISIBLE
  else return Balls.INVISIBLE
}

function generateANewPositionToBalls(rowToMultiply: number, columnToMultiply: number,
  yStartPosition: number, xStartPosition: number, yMultiplier: number, xMultiplier: number): { newYPosition: number, newXPosition: number } {

  return {
    newYPosition:
      yStartPosition +
      yMultiplier * rowToMultiply,
    newXPosition:
      xStartPosition +
      xMultiplier * columnToMultiply
  }

}

function generateANewBarToBallOfTheBigRoad(): BarOfBallOfTheBigRoad {

  numberOfBarsGenerated++

  const newXPositionForTheBigRoadBall: number = X_START_POSITION_FOR_BIG_ROAD_BARS
  const newYPositionForTheBigRoadBall: number =
    Y_START_POSITION_FOR_BIG_ROAD_BARS -
    Y_POSITION_MULTIPLIER_FOR_BIG_ROAD_BARS * numberOfBarsGenerated

  const newPositionOfBarOfTheBigRoadBall = {
    x: newXPositionForTheBigRoadBall,
    y: newYPositionForTheBigRoadBall,
  }

  return {
    key: "" + Math.random() * Math.random() * Math.random() + currentMatch, //! TODO: use lib for make key
    position: newPositionOfBarOfTheBigRoadBall
  }

}

function cleanTheBigRoad(modifiedBall: Balls = Balls.INVISIBLE) {
  isItToCleanTheBigRoad = true
  currentColumnOfBigRoad = 0
  currentRowOfBigRoad = 0
  columnThatStartedTheLongSequenceOfEqualsBalls = 0
  longSequenceOfEqualsBalls = false
  needLockANewRow = false
  lastLockedRowForPutBallsOfTheBigRoad = ROW_LIMIT_INDEX_TO_BIG_ROAD
  ballOfTheBigRoadFromPreviousPlay = undefined
  lastLockedColumnForPutBallsOfTheBigRoad = 0
  modifiedBallOfTheBigRoad = modifiedBall
}

function cleanTheBeadPlate() {
  currentColumnOfBeadPlate = 0
  currentRowOfBeadPlate = 0
  isItToCleanTheBeadPlate = true
}

function cleanTheBigEyeBoy() {
  currentRowOfBigEyeBoy = 0
  currentColumnOfBigEyeBoy = 0
  lastBallOfBigEyeBoy = undefined
}

function cleanTheSmallRoad() {
  currentRowOfSmallRoad = 0
  currentColumnOfSmallRoad = 0
  lastBallOfSmallRoad = undefined
}

function cleanTheCockroachPig() {
  currentRowOfCockroachPig = 0
  currentColumnOfCockroachPig = 0
  lastBallOfCockroachPig = undefined
}

function cleanTheCurrentScore() {
  lastNumberOfPlays = currentNumberOfPlays
  lastNumberOfBankerWins = currentNumberOfBankerWins = 0
  lastNumberOfPlayerWins = currentNumberOfPlayerWins = 0
  lastNumberOfTieWins = currentNumberOfTieWins = 0
  lastNumberOfNaturalWins = currentNumberOfNaturalWins = 0

  currentNumberOfPlays = 0
  currentNumberOfBankerWins = 0
  currentNumberOfPlayerWins = 0
  currentNumberOfTieWins = 0
  currentNumberOfNaturalWins = 0
  currentNumberOfMaxBet = 0
  currentNumberOfMinBet = 0
  currentNumberOfMaxTie = 0
}

function cleanAllMatchData() {
  currentMatch = 0
  numberOfBarsGenerated = 0 //! TODO: Tem que verificar, onde coloca essa variável, se é em alguma outra função de clean
  ballsInBigRoadTable = generateTable<simplifiedBigRoadBallForTheBackEnd>(5, 40)
  ballsInBigRoadTableInPlaysOrder = []
  cleanTheBeadPlate() //! TODO: Tem que verificar se está limpando tudo que precisa
  cleanTheBigRoad() //! TODO: Tem que verificar se está limpando tudo que precisa
  cleanTheBigEyeBoy() //! TODO: Tem que verificar se está limpando tudo que precisa
  cleanTheSmallRoad()
  cleanTheCockroachPig()
  cleanTheCurrentScore()
}

function getCurrentScore(): CurrentScore {
  return {
    banker: String(currentNumberOfBankerWins),
    player: String(currentNumberOfPlayerWins),
    natural: String(currentNumberOfNaturalWins),
    tie: String(currentNumberOfTieWins),
    plays: String(currentNumberOfPlays),
    minBet: String(currentNumberOfMaxBet),
    maxBet: String(currentNumberOfMinBet),
    maxTie: String(currentNumberOfMaxTie),
  }
}

function updateCurrentScore(newBall: Balls) {

  if (newBall === Balls.BANKER) currentNumberOfBankerWins++
  else if (newBall === Balls.PLAYER) currentNumberOfPlayerWins++
  else if (newBall === Balls.TIE_HANDS) currentNumberOfTieWins++
  else if (
    newBall === Balls.BANKER_8 ||
    newBall === Balls.BANKER_9 ||
    newBall === Balls.PLAYER_8 ||
    newBall === Balls.PLAYER_9
  ) {
    currentNumberOfNaturalWins++
    if (newBall === Balls.BANKER_8 || newBall === Balls.BANKER_9) currentNumberOfBankerWins++
    else if (newBall === Balls.PLAYER_8 || newBall === Balls.PLAYER_9) currentNumberOfPlayerWins++
  }
  currentNumberOfPlays++
}

const handler = (req: NextApiRequest, res: NextApiResponse<MatchData | undefined>) => {

  const { body } = req
  const bodyJSON = JSON.parse(body)

  let matchData: MatchData | undefined = {} as MatchData

  if (bodyJSON.message === SocketEvents.HANDLER_ADD_BALL) {

    matchData = addBalls(bodyJSON.newBall)

    // console.log('matchData', matchData)

    res.status(200).json(matchData)
  }
  else if (bodyJSON.message === SocketEvents.HANDLER_CLEAR_SHOE) {
    cleanAllMatchData()
    const currentScore = getCurrentScore()

    const matchResetData: MatchData = {
      newBeadPlateBall: {} as BallBeadPlate,
      isItToClean: {
        allMatchData: true
      },
      currentScore
    }

    res.status(200).json(matchResetData)
  }
  else if (bodyJSON.message === MESSAGE_FOR_MAKE_INITIAL_STATE_OF_THE_GAME) {

    cleanAllMatchData()
    const currentScore = getCurrentScore()

    const matchResetData: MatchData = {
      newBeadPlateBall: {} as BallBeadPlate,
      newBigRoadBall: {} as BallBigRoad,
      newBigRoadBar: {} as BarOfBallOfTheBigRoad,
      isItToClean: {
        allMatchData: true,
      },
      currentScore
    }

    res.status(200).json(matchResetData)

  }

};

export default handler;