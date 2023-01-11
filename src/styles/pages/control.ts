import { styled } from '..';

import bankerBgBtn from '../../assets/control/banker/banker-btn.png'
import bankerPressedBgBtn from '../../assets/control/banker/banker-btn-pressed.png'
import bankerDisabledBgBtn from '../../assets/control/banker/banker-btn-disabled.png'

import playerBgBtn from '../../assets/control/player/player-btn.png'
import playerPressedBgBtn from '../../assets/control/player/player-btn-pressed.png'
import playerDisabledBgBtn from '../../assets/control/player/player-btn-disabled.png'

import player8BgBtn from '../../assets/control/player-8/player-8-btn.png'
import player8PressedBgBtn from '../../assets/control/player-8/player-8-btn-pressed.png'
import player8DisabledBgBtn from '../../assets/control/player-8/player-8-btn-disabled.png'

import player9BgBtn from '../../assets/control/player-9/player-9-btn.png'
import player9PressedBgBtn from '../../assets/control/player-9/player-9-btn-pressed.png'
import player9DisabledBgBtn from '../../assets/control/player-9/player-9-btn-disabled.png'

import tieBgBtn from '../../assets/control/tie/tie-btn.png'
import tiePressedBgBtn from '../../assets/control/tie/tie-btn-pressed.png'
import tieDisabledBgBtn from '../../assets/control/tie/tie-btn-disabled.png'

import banker8BgBtn from '../../assets/control/banker-8/banker-8-btn.png'
import banker8PressedBgBtn from '../../assets/control/banker-8/banker-8-btn-pressed.png'
import banker8DisabledBgBtn from '../../assets/control/banker-8/banker-8-btn-disabled.png'

import banker9BgBtn from '../../assets/control/banker-9/banker-9-btn.png'
import banker9PressedBgBtn from '../../assets/control/banker-9/banker-9-btn-pressed.png'
import banker9DisabledBgBtn from '../../assets/control/banker-9/banker-9-btn-disabled.png'

import cancelBgBtn from '../../assets/control/cancel/cancel-btn.png'
import cancelPressedBgBtn from '../../assets/control/cancel/cancel-btn-pressed.png'
import cancelDisabledBgBtn from '../../assets/control/cancel/cancel-btn-disabled.png'

import cancelLastBgBtn from '../../assets/control/cancel-last/cancel-last-btn.png'
import cancelLastPressedBgBtn from '../../assets/control/cancel-last/cancel-last-btn-pressed.png'
import cancelLastDisabledBgBtn from '../../assets/control/cancel-last/cancel-last-btn-disabled.png'

import clearShoeBgBtn from '../../assets/control/clear-shoe/clear-shoe-btn.png'
import clearShoePressedBgBtn from '../../assets/control/clear-shoe/clear-shoe-btn-pressed.png'
import clearShoeDisabledBgBtn from '../../assets/control/clear-shoe/clear-shoe-btn-disabled.png'

import configBgBtn from '../../assets/control/config/config-btn.png'
import configPressedBgBtn from '../../assets/control/config/config-btn-pressed.png'
import configDisabledBgBtn from '../../assets/control/config/config-btn-disabled.png'

import closeBgBtn from '../../assets/control/close/close-btn.png'
import closePressedBgBtn from '../../assets/control/close/close-btn-pressed.png'
import closeDisabledBgBtn from '../../assets/control/close/close-btn-disabled.png'



export const ControlContainerMain = styled('div', {
  width: '100vw',
  height: '100vh'
})

export const ControlContainer = styled('div', {
  width: '100vh',
  height: '100vw',
  background: 'gray-900',
  padding: '4.88vw 2.5vh 0vw 2.5vh',
  display: 'grid',
  transform: 'rotate(-90deg) translate(35.5vh, 20.75vw)'
})

export const TopContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '1.94vw',
  height: '20.9vw',
  width: '94.6vh'
})

export const TopButton = styled('button', {
  width: '46.33vh',
  height: '20.9vw',
  backgroundSize: '100% 100%',

  variants: {
    variant: {

      player: {
        backgroundImage: `url(${playerBgBtn.src})`,

        '&:disabled': {
          backgroundImage: `url(${playerDisabledBgBtn.src})`,
        },

        '&:not(:disabled):active': {
          backgroundImage: `url(${playerPressedBgBtn.src})`,
        }
      },

      banker: {
        backgroundImage: `url(${bankerBgBtn.src})`,

        '&:disabled': {
          backgroundImage: `url(${bankerDisabledBgBtn.src})`,
        },

        '&:not(:disabled):active': {
          backgroundImage: `url(${bankerPressedBgBtn.src})`,
        }
      }

    }
  },
})

export const MiddleContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '0.9375vw',
  width: '37.13vh',
  height: '35.1vw',
})

export const MiddleButton = styled('button', {
  position: 'relative',
  width: '37.17vh',
  height: '15.43vw',
  backgroundSize: '100% 100%',

  variants: {
    variant: {

      player8: {
        backgroundImage: `url(${player8BgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${player8DisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${player8PressedBgBtn.src})`,
        }
      },

      player9: {
        backgroundImage: `url(${player9BgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${player9DisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${player9PressedBgBtn.src})`,
        }
      },

      tie: {
        top: '3.71vw',
        width: '17.17vh',
        height: '27.64vw',

        backgroundImage: `url(${tieBgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${tieDisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${tiePressedBgBtn.src})`,
        }
      },

      banker8: {
        backgroundImage: `url(${banker8BgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${banker8DisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${banker8PressedBgBtn.src})`,
        }
      },

      banker9: {
        backgroundImage: `url(${banker9BgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${banker9DisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${banker9PressedBgBtn.src})`,
        }
      },


    }
  }

})

export const BottomContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginLeft: '1.26vw',
  rowGap: '2.2vw',
  columnGap: '4.84vh',
})

export const BottomButton = styled('button', {
  position: 'relative',
  width: '26.83vh',
  height: '9.86vw',
  backgroundSize: '100% 100%',

  variants: {
    variant: {
      cancel: {
        left: '8.84vh',
        width: '72.67vh',
        height: '12.79vw',

        backgroundImage: `url(${cancelBgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${cancelDisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${cancelPressedBgBtn.src})`,
        }
      },
      cancelLast: {
        left: '8.84vh',
        width: '72.67vh',
        height: '12.79vw',

        backgroundImage: `url(${cancelLastBgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${cancelLastDisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${cancelLastPressedBgBtn.src})`,
        }
      },
      clearShoe: {
        backgroundImage: `url(${clearShoeBgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${clearShoeDisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${clearShoePressedBgBtn.src})`,
        }
      },
      config: {
        backgroundImage: `url(${configBgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${configDisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${configPressedBgBtn.src})`,
        }
      },
      close: {
        backgroundImage: `url(${closeBgBtn.src})`,
        '&:disabled': {
          backgroundImage: `url(${closeDisabledBgBtn.src})`,
        },
        '&:not(:disabled):active': {
          backgroundImage: `url(${closePressedBgBtn.src})`,
        }
      },
    }
  }

})