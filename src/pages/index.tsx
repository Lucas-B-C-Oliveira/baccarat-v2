
import { useEffect, useRef } from 'react'
import { GetStaticProps } from "next";
import { BallBigRoad, Balls, CurrentScore, MESSAGE_FOR_MAKE_INITIAL_STATE_OF_THE_GAME, SocketEvents } from '../utils/globalTypesEnumsAndInterfaces'
import {
  BallDiv,
  BarDiv,
  ScoreboardContainer,
  CurrentScoreContainer,
  CurrentScoreText,
  LastTextScoreContainer,
  CurrentValuesImage,
  InnerBar,
  ContainerBar
} from './../styles/pages/scoreboard'

import { io, Socket } from 'socket.io-client'

import { useSelector, useDispatch } from 'react-redux'
import { addBallsOnBeadPlate, cleanTheBeadPlate, getBeadPlateBalls, setBallOnBeadPlate } from '../slices/beadPlateSlice'
import { getBigRoadBalls, addBallsOnBigRoad, setBallOnBigRoad, cleanTheBigRoad, addBarOnLastBallOfTheBigRoad } from './../slices/bigRoadSlice';
import { BallBeadPlate, MatchData } from './../utils/globalTypesEnumsAndInterfaces';

export default function Scoreboard({ currentScore }: MatchData) {

  const ballsOfBeadPlate = useSelector(getBeadPlateBalls)
  const ballsOfBigRoad = useSelector(getBigRoadBalls)
  const dispatch = useDispatch()
  const isDev = useRef(true) //! TODO: Remove this variable when project is done
  const socket = useRef<null | Socket>(null)


  const X_POSITION_OF_FIRST_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE = 1101 //! TODO: In the Future, put this on the server, through SSG 
  const X_POSITION_OF_SECOND_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE = 1417 //! TODO: In the Future, put this on the server, through SSG 

  const currentScoreValue = useRef<CurrentScore>(currentScore as CurrentScore)

  async function socketInitializer() {
    await fetch('http://localhost:3000/api/socket')
    socket.current = io()

    socket.current.on(SocketEvents.ADD_BALL, (newMatchData: MatchData) => {
      const { newBeadPlateBall, isItToClean, newBigRoadBall, newBigRoadBar, currentScore } = newMatchData

      console.log('newMatchData', newMatchData)

      if (currentScore) {
        currentScoreValue.current = currentScore
        console.log('currentScoreValue', currentScoreValue.current)
      }

      if (newBeadPlateBall) {
        if (isItToClean?.allBallsOnBeadPlate) dispatch(setBallOnBeadPlate(newBeadPlateBall))
        else dispatch(addBallsOnBeadPlate(newBeadPlateBall))
      }

      if (newBigRoadBall) {
        if (isItToClean?.allBallsOnBigRoad) dispatch(setBallOnBigRoad(newBigRoadBall))
        else dispatch(addBallsOnBigRoad(newBigRoadBall))
      }

      if (newBigRoadBar) {
        // if (isItToClean?.allBallsOnBigRoad) dispatch(setBallOnBigRoad(newBigRoadBall))
        // else dispatch(addBallsOnBigRoad(newBigRoadBall))
        dispatch(addBarOnLastBallOfTheBigRoad(newBigRoadBar))
      }

    })

    socket.current.on(SocketEvents.CLEAR_SHOE, (newMatchData: MatchData) => {
      const { isItToClean, currentScore } = newMatchData

      if (currentScore) {
        currentScoreValue.current = currentScore
      }

      if (isItToClean?.allMatchData) {
        dispatch(cleanTheBeadPlate())
        dispatch(cleanTheBigRoad())
      }

    })
  }

  useEffect(() => {
    if (isDev.current) {
      isDev.current = false
      socketInitializer()
    }
  }, [])

  return (
    <ScoreboardContainer>

      {ballsOfBeadPlate.map((ball: BallBeadPlate) => (
        <BallDiv
          key={ball.key}
          // css={{ left: ball.position.x + 'vw', top: ball.position.y + 'vh' }}
          css={{ left: ball.position.x, top: ball.position.y }}
          variant={ball.image}
        />
      ))}

      {ballsOfBigRoad.map((ball: BallBigRoad) => (
        <BallDiv
          key={ball.key}
          css={{ left: ball.position.x, top: ball.position.y }}
          variant={ball.image}
        >
          {ball.bars.map((bar) => (
            <BarDiv
              key={bar.key}
              css={{ left: bar.position.x, top: bar.position.y }}
            />
          ))}

        </BallDiv>
      ))}


      {/* <CurrentScoreContainer> */}

      <CurrentScoreText variant={'current'} css={{ left: X_POSITION_OF_FIRST_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE, top: 192 }} >
        {currentScoreValue.current.banker}
      </CurrentScoreText>

      <CurrentScoreText variant={'current'} css={{ left: X_POSITION_OF_FIRST_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE, top: 233 }}  >
        {currentScoreValue.current.player}
      </CurrentScoreText>

      <CurrentScoreText variant={'current'} css={{ left: X_POSITION_OF_FIRST_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE, top: 274 }} >
        {currentScoreValue.current.natural}
      </CurrentScoreText>

      <CurrentScoreText variant={'current'} css={{ left: X_POSITION_OF_FIRST_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE, top: 313 }}  >
        {currentScoreValue.current.tie}
      </CurrentScoreText>

      <CurrentScoreText variant={'current'} css={{ left: X_POSITION_OF_SECOND_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE, top: 192 }} >
        {currentScoreValue.current.plays}
      </CurrentScoreText>

      <CurrentScoreText variant={'current'} css={{ left: X_POSITION_OF_SECOND_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE, top: 233 }}  >
        {currentScoreValue.current.minBet}
      </CurrentScoreText>

      <CurrentScoreText variant={'current'} css={{ left: X_POSITION_OF_SECOND_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE, top: 274 }} >
        {currentScoreValue.current.maxBet}
      </CurrentScoreText>

      <CurrentScoreText variant={'current'} css={{ left: X_POSITION_OF_SECOND_COLUMN_VALUES_OF_CURRENT_SCORE_TABLE, top: 313 }}  >
        {currentScoreValue.current.maxTie}
      </CurrentScoreText>

      {/* </CurrentScoreContainer> */}


      <ContainerBar type={'main'} css={{ left: 815, top: 357 }}>
        <InnerBar type={'main'} color={'banker'} css={{ width: '33.33%' }}>10%</InnerBar>
        <InnerBar type={'main'} color={'player'} css={{ width: '33.33%' }}>10%</InnerBar>
        <InnerBar type={'main'} color={'tie'} css={{ width: '33.33%' }}>10%</InnerBar>
      </ContainerBar>

    </ScoreboardContainer>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  //! TODO: Remember to make an initial state that comes from the server to assemble the game and put all the variables that
  //! the front-end uses in that initial state

  //! TODO: Coloque todas as constantes no servidor, inclusive as que estão nos estilos, tipo imagem de bg e etc...
  const body = {
    message: MESSAGE_FOR_MAKE_INITIAL_STATE_OF_THE_GAME
  }

  const initialStateOfTheGame = await fetch('http://localhost:3000/api/score-manager', {
    method: 'POST',
    body: JSON.stringify(body)
  })

  const initialStateOfTheGameJson = await initialStateOfTheGame.json()


  // console.log('initialStateOfTheGameJson', initialStateOfTheGameJson)


  return {
    props: {
      ...initialStateOfTheGameJson
    },
    // revalidate: 60 * 60 * 2 /// 2 hours
  }
}
