import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LoaderProvider } from './components/LoaderContext';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <LoaderProvider> */}
    <App />
    {/* </LoaderProvider> */}
  </StrictMode>,
)
