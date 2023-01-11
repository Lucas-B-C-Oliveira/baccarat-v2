import { globalCss } from ".";

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
  },

  body: {
    '-webkit-font-smoothing': 'antialiased',
  },

  'body, input, textarea, button': {
    fontFamily: 'Roboto',
    fontWeight: 400,
    border: 'none',
    backgroundColor: 'none',
    color: 'none'
  },

  '@font-face': [
    {
      fontFamily: 'GenkoGold',
      // src: 'url("fonts/GenkoGold.otf")',
      src: 'url("fonts/GenkoGold.otf")',
    },
    {
      fontFamily: 'GenkoRegular',
      src: 'url("fonts/GenkoRegular.otf")',
    },
  ],
})