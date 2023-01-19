import { styled } from '..';
import scoreboardImageBackground from './../../assets/scoreboard/background-scoreboard.png'
import bankerBall from '../../assets/scoreboard/banker.png'
import playerBall from '../../assets/scoreboard/player.png'
import tieHandsBall from '../../assets/scoreboard/tie-hands-ball.png'
import tieHandsBar from '../../assets/scoreboard/tie-hands-bar.png'
import player8Ball from '../../assets/scoreboard/player-8.png'
import player9Ball from '../../assets/scoreboard/player-9.png'
import banker8Ball from '../../assets/scoreboard/banker-8.png'
import banker9Ball from '../../assets/scoreboard/banker-9.png'
import invisibleBall from '../../assets/scoreboard/ball-empty.png' //! TODO: Remove this when project is done
import currentValuesUi from '../../assets/scoreboard/current-values-ui.png'

export const ScoreboardContainer = styled('div', {
  position: 'fixed',
  // width: '100vw',
  // height: '100vh',
  width: 1920,
  height: 1080,
  background: `url(${scoreboardImageBackground.src})`, //! TODO: try on it to import font
  backgroundSize: '100% 100%',
  left: 0,
  top: 0,
  backgroundColor: '$red500',

})


export const CurrentScoreContainer = styled('div', {
  position: 'absolute',
  display: 'grid',
  gridTemplateColumns: '7.38vw 9.1vw',
  gridTemplateRows: '1fr 1fr 1fr 1fr',
  gridAutoFlow: 'column',
  columnGap: '14.4vw',
  left: '67.2vw',
  top: '2.9vh',
})

export const LastTextScoreContainer = styled('div', {
  position: 'absolute',
  // display: 'grid',
  // gridTemplateColumns: '1fr',
  // gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
  // rowGap: '0vh',
  // left: '19.5vw',
  // top: '78.4vh',
  left: 0,
  top: 0,
})

export const CurrentScoreText = styled('span', {
  // display: 'flex',
  position: 'absolute',
  // flexDirection: 'column',
  // whiteSpace: 'nowrap',

  variants: {
    variant: {
      current: {
        fontSize: 40,
        fontFamily: 'GenkoRegular',
        textAlign: 'left',
      },
      last: {
        fontSize: '3.3vw',
        fontFamily: 'GenkoGold',
        textAlign: 'right',
      }
    }
  }
})

export const CurrentValuesImage = styled('img', {
  position: 'absolute',

  width: '36.72vw',
  height: '21.2vh',
  left: '52vw',
  top: '3vh',
})

export const BallDiv = styled('div', {

  position: 'absolute',
  // width: '2.29vw',
  // height: '4.07vh',
  // backgroundSize: '2.29vw 4.07vh',

  width: 32.0,
  height: 32.0,
  backgroundSize: '100% 100%',

  backgroundRepeat: 'no-repeat',

  variants: {
    image: {
      player: {
        backgroundImage: `url(${playerBall.src})`,
      },

      banker: {
        background: `url(${bankerBall.src})`,
      },

      tieHands: {
        background: `url(${tieHandsBall.src})`,
      },

      player8: {
        background: `url(${player8Ball.src})`,
      },

      player9: {
        background: `url(${player9Ball.src})`,
      },

      banker8: {
        background: `url(${banker8Ball.src})`,
      },

      banker9: {
        background: `url(${banker9Ball.src})`,
      },

      invisible: {
        background: `url(${invisibleBall.src})`,
      },

    },
    size: {
      bigEyeBoyBall: {
        width: 14,
        height: 14,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }
    }
  }

})

export const BarDiv = styled('div', {

  position: 'absolute',
  width: 20,
  height: 4,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  background: `url(${tieHandsBar.src})`,

  // width: '2.29vw',
  // height: '4.07vh',
  // backgroundSize: '2.29vw 4.07vh',

})

export const ContainerBar = styled('div', {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '1.875rem',
  boxShadow: '0rem 0.125rem 0.1875rem 0rem #0f172aae',
  display: 'flex',

  variants: {
    type: {
      main: {
        top: 400,
        left: 850,
        height: 37,
        width: 625,
      },
      previousScoreBar: {
        height: '4vh',
        width: '32.25vw',
      }
    }
  }

})

export const InnerBar = styled('div', {
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  justifyContent: 'center',
  color: '#000000',
  fontFamily: 'GenkoRegular',

  variants: {
    type: {
      main: {
        fontSize: 28,
      },
      previousScoreBar: {
        fontSize: 25,
      }
    },
    color: {
      banker: {
        backgroundImage: `linear-gradient(
          #f66262,
          #f66262,
          #f65a59,
          #f65a59,
          #f24e4d,
          #f24e4d,
          #ee4342,
          #ee4342,
          #d71312,
          #c10e0c,
          #c00e0c,
          #b21311,
          #af100f,
          #af100f,
          #ae0c0b
        )`,
      },
      player: {
        backgroundImage: `linear-gradient(
          #909ee7,
          #7c8ce4,
          #7487e4,
          #697ee4,
          #6474e4,
          #576bdb,
          #475fcc,
          #4054c0,
          #344cb4,
          #203394,
          #203394,
          #203394,
          #203394,
          #203394,
          #203394,
          #203394
        )`,
      },
      tie: {
        backgroundImage: `linear-gradient(
          #90df99,
          #84dc8c,
          #7cd484,
          #66cc71,
          #54c45c,
          #48bc54,
          #3cb848,
          #2cac3c,
          #1e922c,
          #14711f,
          #14711f,
          #14711f,
          #14711f,
          #14711f,
          #14711f,
          #14711f
        )`,
      }
    }
  },

})
