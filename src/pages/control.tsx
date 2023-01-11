
import { useEffect, useRef, useState } from 'react';
import { Balls, ButtonsName, SocketEvents } from '../utils/globalTypesEnumsAndInterfaces';
import { ControlContainer, ControlContainerMain, TopButton, TopContainer, MiddleContainer, MiddleButton, BottomContainer, BottomButton } from './../styles/pages/control';
import { io, Socket } from 'socket.io-client'




export default function Control() {

  const [disabledState, setDisabledState] = useState(false)
  const buttonOnConfirmation = useRef<ButtonsName>(ButtonsName.DEFAULT)
  const socket = useRef<null | Socket>(null)

  async function socketInitializer() {
    await fetch('http://localhost:3000/api/socket')
    socket.current = io()
  }

  useEffect(() => {
    socketInitializer()
  }, [])

  function addBallsInScore(ball: Balls) {
    if (socket.current) socket.current.emit(SocketEvents.HANDLER_ADD_BALL, ball)
  }

  function clearShoe() {
    if (socket.current) socket.current.emit(SocketEvents.HANDLER_CLEAR_SHOE)
  }

  function setDisableButtonsState(
    isInConfirmation: boolean,
    buttonToIgnore: ButtonsName = ButtonsName.DEFAULT,
  ) {
    buttonOnConfirmation.current = buttonToIgnore
    setDisabledState(!isInConfirmation)
  }

  /// Handle Functions ######
  function handleCancelButton() {
    setDisableButtonsState(true)
  }

  function handleCancelLastButton() {
    // setDisableButtonsState(true)
    console.log('CancelLast button clicked')
    //! TODO: Need Implemented here
  }

  function handleClearShoeButton() {
    if (disabledState) {
      clearShoe()
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.CLEAR_SHOE)
  }

  function handleConfigButton() {
    // setDisableButtonsState(true)
    console.log('Config button clicked')
    //! TODO: Need Implemented here
  }

  function handleCloseButton() {
    if (disabledState) {
      // @ts-ignore
      window?.api.shutDown()
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.CLOSE)
  }

  function handlePlayerButton() {
    if (disabledState) {
      addBallsInScore(Balls.PLAYER)
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.PLAYER)
  }

  function handleBankerButton() {
    if (disabledState) {
      addBallsInScore(Balls.BANKER)
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.BANKER)
  }

  function handleTieHandsButton() {
    if (disabledState) {
      addBallsInScore(Balls.TIE_HANDS)
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.TIE_HANDS)
  }

  function handlePlayer8Button() {
    if (disabledState) {
      addBallsInScore(Balls.PLAYER_8)
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.PLAYER_8)
  }

  function handlePlayer9Button() {
    if (disabledState) {
      addBallsInScore(Balls.PLAYER_9)
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.PLAYER_9)
  }

  function handleBanker8Button() {
    if (disabledState) {
      addBallsInScore(Balls.BANKER_8)
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.BANKER_8)
  }

  function handleBanker9Button() {
    if (disabledState) {
      addBallsInScore(Balls.BANKER_9)
      setDisableButtonsState(true)
    } else setDisableButtonsState(false, ButtonsName.BANKER_9)
  }

  return (
    <ControlContainerMain>
      <ControlContainer>

        <TopContainer>
          <TopButton variant={'player'} onClick={handlePlayerButton} disabled={
            buttonOnConfirmation.current !== ButtonsName.PLAYER
              ? disabledState
              : !disabledState
          } />
          <TopButton variant={'banker'} onClick={handleBankerButton} disabled={
            buttonOnConfirmation.current !== ButtonsName.BANKER
              ? disabledState
              : !disabledState
          } />
        </TopContainer>

        <MiddleContainer>
          <MiddleButton variant={'player8'} onClick={handlePlayer8Button} disabled={
            buttonOnConfirmation.current !== ButtonsName.PLAYER_8
              ? disabledState
              : !disabledState
          } />
          <MiddleButton variant={'player9'} onClick={handlePlayer9Button} disabled={
            buttonOnConfirmation.current !== ButtonsName.PLAYER_9
              ? disabledState
              : !disabledState
          } />
          <MiddleButton variant={'tie'} onClick={handleTieHandsButton} disabled={
            buttonOnConfirmation.current !== ButtonsName.TIE_HANDS
              ? disabledState
              : !disabledState
          } />
          <MiddleButton variant={'banker8'} onClick={handleBanker8Button} disabled={
            buttonOnConfirmation.current !== ButtonsName.BANKER_8
              ? disabledState
              : !disabledState
          } />
          <MiddleButton variant={'banker9'} onClick={handleBanker9Button} disabled={
            buttonOnConfirmation.current !== ButtonsName.BANKER_9
              ? disabledState
              : !disabledState
          } />
        </MiddleContainer>

        <BottomContainer>
          {disabledState ? (
            <BottomButton variant={'cancel'} onClick={handleCancelButton} />
          ) : (
            <BottomButton variant={'cancelLast'} onClick={handleCancelLastButton} />
          )}
          <BottomButton variant={'clearShoe'} onClick={handleClearShoeButton} disabled={
            buttonOnConfirmation.current !== ButtonsName.CLEAR_SHOE
              ? disabledState
              : !disabledState
          } />
          <BottomButton variant={'config'} onClick={handleConfigButton} disabled={
            buttonOnConfirmation.current !== ButtonsName.CONFIG
              ? disabledState
              : !disabledState
          } />
          <BottomButton variant={'close'} onClick={handleCloseButton} disabled={
            buttonOnConfirmation.current !== ButtonsName.CLOSE
              ? disabledState
              : !disabledState
          } />

        </BottomContainer>

      </ControlContainer>
    </ControlContainerMain>
  )
}