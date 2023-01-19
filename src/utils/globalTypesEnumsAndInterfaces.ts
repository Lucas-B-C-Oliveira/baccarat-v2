
export enum Balls {
  BANKER = "banker",
  PLAYER = "player",
  TIE_HANDS = "tieHands",
  PLAYER_8 = "player8",
  PLAYER_9 = "player9",
  BANKER_8 = "banker8",
  BANKER_9 = "banker9",
  INVISIBLE = "invisible",
}

export enum ButtonsName {
  PLAYER = 'player',
  BANKER = 'banker',
  PLAYER_8 = 'player8',
  PLAYER_9 = 'player9',
  BANKER_8 = 'banker8',
  BANKER_9 = 'banker9',
  TIE_HANDS = 'tieHands',
  CANCEL_LAST_PLAY = 'cancelLastPlay',
  CANCEL = 'cancel',
  CLEAR_SHOE = 'clearShoe',
  CONFIG = 'config',
  CLOSE = 'close',
  DEFAULT = '',
}

export enum SocketEvents {
  HANDLER_ADD_BALL = 'handler add ball',
  ADD_BALL = 'add ball',
  HANDLER_CLEAR_SHOE = 'handler clear shoe',
  CLEAR_SHOE = 'clear shoe',
  DISCONNECT = 'disconnect',
  CONNECTION = 'connection'
}

export const MESSAGE_FOR_MAKE_INITIAL_STATE_OF_THE_GAME = 'give me the initial state of the game'

export interface Position {
  x: number
  y: number
}

export interface BallBeadPlate {
  key: string
  image: Balls,
  position: Position
}

export interface BeadPlateState {
  beadPlateBalls: BallBeadPlate[]
}

export interface BarOfBallOfTheBigRoad {
  key: string
  position: Position
}

export type BigRoadBallImage = Balls.BANKER | Balls.PLAYER | Balls.INVISIBLE | undefined
export type SmallRoadBallImage = Balls.BANKER | Balls.PLAYER | Balls.INVISIBLE | undefined
export type CockroachPigImage = Balls.BANKER | Balls.PLAYER | Balls.INVISIBLE | undefined

export interface BallBigRoad {
  key: string
  image: BigRoadBallImage,
  position: Position
  bars: BarOfBallOfTheBigRoad[],
  row?: number,
  column?: number

}

export interface BigRoadState {
  bigRoadBalls: BallBigRoad[]
}

export interface BigEyeBoyBall {
  key: string
  image: BigRoadBallImage,
  position: Position
}

export interface BigEyeBoyState {
  bigEyeBoyBalls: BigEyeBoyBall[]
}

export interface SmallRoadBall {
  key: string
  image: SmallRoadBallImage,
  position: Position
}

export interface SmallRoadState {
  smallRoadBalls: SmallRoadBall[]
}

export interface CockroachPigBall {
  key: string
  image: CockroachPigImage,
  position: Position
}

export interface CockroachPigState {
  cockroachPigBalls: CockroachPigBall[]
}

export interface IsItToClean {
  allMatchData?: boolean
  allBallsOnBeadPlate?: boolean
  allBallsOnBigRoad?: boolean
  allBallsOnBigEyeBoy?: boolean
  allBallsOnSmallRoad?: boolean
  allBallsOnCockroachPig?: boolean
}

export interface MatchData {
  isItToClean?: IsItToClean
  newBeadPlateBall?: BallBeadPlate
  newBigRoadBall?: BallBigRoad
  newBigRoadBar?: BarOfBallOfTheBigRoad
  newBigEyeBoyBall?: BigEyeBoyBall
  newSmallRoadBall?: SmallRoadBall
  newCockroachPigBall?: CockroachPigBall
  currentScore?: CurrentScore
}

export interface CurrentScore {
  banker: string
  player: string
  natural: string
  tie: string
  plays: string
  minBet: string
  maxBet: string
  maxTie: string
}
