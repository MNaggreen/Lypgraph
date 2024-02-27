import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { QueryProvider } from './lib/react-query/QueryProvider'

ReactDom.createRoot(document.getElementById('root') as Element).render(
  <BrowserRouter>
  {/* QueryProvider.tsx необходим, без него работать не будет */}
<QueryProvider>
  {/* AuthCOntext.tsx */}
    <AuthProvider>
      <App />
    </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
)
