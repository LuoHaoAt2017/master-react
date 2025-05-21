import { StrictMode } from 'react'
import ReactDom from 'react-dom'
import App from './App.jsx'

ReactDom.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
