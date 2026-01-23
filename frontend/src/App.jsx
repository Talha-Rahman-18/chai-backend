import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Scrolltop from './component/Scrolltop'
import './App.css'
import Header from './component/header/Header'
import Sidebar from './component/sidebar/Sidebar'
import { Toaster } from 'react-hot-toast'

function App() {

  

return (
   
<div className="appcont">

<header className="header">
<Header />
</header>
<Sidebar />
<Scrolltop />

<main className="outlet">
<Outlet />
</main>


  <Toaster backgroundColor="red" position="top-right" reverseOrder={false} />
</div>
  )
}

export default App
