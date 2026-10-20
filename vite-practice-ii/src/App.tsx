import './App.css'
import { Route, Routes } from 'react-router'
// import Dashboard from './Dashboard'
import Home from './Home'
// import Settings from './Settings'
import React, { Suspense } from 'react'

const Dashboard = React.lazy(() =>
  import('./Dashboard').then((m) => ({ default: m.Dashboard }))
)
const Settings = React.lazy(() => import('./Settings'))

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={
          <Suspense>
            <Dashboard />
          </Suspense>
        }
        />
        <Route path="/settings" element={
          <Suspense>
            <Settings />
          </Suspense>
        }
        />
      </Routes>
    </>
  )
}

export default App
