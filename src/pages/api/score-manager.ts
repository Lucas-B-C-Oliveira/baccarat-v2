import { match } from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import { BallBeadPlate, BallBigRoad, Balls, CurrentScore, MatchData, MESSAGE_FOR_MAKE_INITIAL_STATE_OF_THE_GAME, SocketEvents } from "../../utils/globalTypesEnumsAndInterfaces";
import { BarOfBallOfTheBigRoad } from './../../utils/globalTypesEnumsAndInterfaces';


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

let isItToCleanTheBigRoad: boolean = false

let ballOfTheBigRoadFromPreviousPlay: Balls.BANKER | Balls.PLAYER | Balls.INVISIBLE | undefined
let lastLockedRowForPutBallsOfTheBigRoad: number = ROW_LIMIT_INDEX_TO_BIG_ROAD
let lastLockedColumnForPutBallsOfTheBigRoad: number = 0
let currentRowOfBigRoad: number = 0
let currentColumnOfBigRoad: number = 0
let needLockANewRow: boolean = false
let columnThatStartedTheLongSequenceOfEqualsBalls: number = 0 //! TODO: Understand what this variable is for | and put a clearer and more specific name
let longSequenceOfEqualsBalls: boolean = false
let modifiedBallOfTheBigRoad: Balls = Balls.INVISIBLE //! TODO: Maybe we need to remove this variable

/// #### BARS 
let barOfBallOfTheBigRoad: BarOfBallOfTheBigRoad | undefined
let numberOfBarsGenerated: number = 0

const X_START_POSITION_FOR_BIG_ROAD_BARS = 11
const Y_START_POSITION_FOR_BIG_ROAD_BARS = 35
const Y_POSITION_MULTIPLIER_FOR_BIG_ROAD_BARS = 5
const MAXIMUM_BAR_LIMIT_ON_A_BALL = 7

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

  const newBeadPlateBall = addBallInBeadPlate(newBall)
  const newBigRoadData = addBallInBigRoad(newBall)
  const currentScore = getCurrentScore()

  currentMatch++

  const newMatchData: MatchData = {
    newBeadPlateBall,
    newBigRoadBall: "image" in newBigRoadData ? newBigRoadData : undefined,
    newBigRoadBar: !("image" in newBigRoadData) ? newBigRoadData : undefined,
    isItToClean: {
      allBallsOnBeadPlate: isItToCleanTheBeadPlate,
      allBallsOnBigRoad: isItToCleanTheBigRoad
    },
    currentScore
  }

  return newMatchData
}

function addBallInBeadPlate(newBall: Balls): BallBeadPlate {

  isItToCleanTheBeadPlate = false

  if (currentMatch % ROW_LIMIT_INDEX_TO_BEAD_PLATE === 0 && currentMatch !== 0) {
    currentColumnOfBeadPlate++
    currentRowOfBeadPlate = 0
  }

  if (currentColumnOfBeadPlate >= COLUMN_LIMIT_INDEX_TO_BEAD_PLATE) cleanTheBeadPlate()

  const { newYPosition, newXPosition } = generateANewPositionToBalls(currentRowOfBeadPlate, currentColumnOfBeadPlate, Y_START_POSITION_FOR_BEAD_PLATE_BALLS)

  currentRowOfBeadPlate++

  return {
    key: "" + Math.random() * Math.random() * Math.random() + currentMatch, //! TODO: use lib for make key
    position: { x: newXPosition, y: newYPosition },
    image: newBall,
  }
}

function addBallInBigRoad(newBall: Balls): BallBigRoad | BarOfBallOfTheBigRoad {
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

  const { newYPosition, newXPosition } = generateANewPositionToBalls(currentRowOfBigRoad, currentColumnOfBigRoad, Y_START_POSITION_FOR_BIG_ROAD_BALLS)

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
  }
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
  yStartPosition: typeof Y_START_POSITION_FOR_BEAD_PLATE_BALLS | typeof Y_START_POSITION_FOR_BIG_ROAD_BALLS): { newYPosition: number, newXPosition: number } {

  return {
    newYPosition:
      yStartPosition +
      Y_AND_X_POSITION_MULTIPLIER_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS * rowToMultiply,
    newXPosition:
      X_START_POSITION_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS +
      Y_AND_X_POSITION_MULTIPLIER_FOR_BEAD_PLATE_AND_BIG_ROAD_BALLS * columnToMultiply
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
  cleanTheBeadPlate() //! TODO: Tem que verificar se está limpando tudo que precisa
  cleanTheBigRoad() //! TODO: Tem que verificar se está limpando tudo que precisa
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

    console.log('matchData', matchData)

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