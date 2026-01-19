import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Scrolltop from './component/Scrolltop'
import './App.css'
import Header from './component/header/Header'
import Sidebar from './component/sidebar/Sidebar'


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

</div>
  )
}

export default App
