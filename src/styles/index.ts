import { createStitches } from '@stitches/react'

export const {
  config,
  styled,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  css
} = createStitches({
  theme: {
    colors: {

      /// Colors being used
      gray900: '#121214',
      gray600: '#323238',
      /// ################

      //! TODO: Delete other colors when project ends
      gray300: '#c4c4cc',
      gray100: '#e1e1e6',

      red500: '#AB222E',
      red700: '#7A1921',

      yellow500: '#FBA94C',

      green500: '#00875f',
      green300: '#00b37e',
      white: '#fff',
    },

    //! TODO: Delete fontSizes when project ends

    fontSizes: {
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
    }
  }
})