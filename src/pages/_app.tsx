import type { AppProps } from 'next/app'
import { globalStyles } from './../styles/global';
import { store } from '../store/store'
import { Provider } from 'react-redux'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
