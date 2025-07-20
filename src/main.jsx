
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import SmokeyCursor from './SmokeyCursor.js'

createRoot(document.getElementById('root')).render(
  <>
  <SmokeyCursor/>
    <App />
  </>,
)
