import React, { useEffect } from 'react'
import assets from '../assets/assets'

const ThemeToggleBtn = ({theme, setTheme}) => {

    useEffect(() => {
        if(theme === 'dark'){
            document.documentElement.classList.add('dark')
        }else{
            document.documentElement.classList.add('light')
        }
        localStorage.setItem('theme', theme)
    },[theme])
  return (
    <div>
       <button>
        {theme === 'dark' ? (
            <img 
            onClick={() => setTheme('light')}
            src={assets.sun_icon} 
            className='size-8.5 p-1.5 border border-gray-500 rounded-full' 
            alt="" 
            />) : (
                <img 
                onClick={() => setTheme('dark')}
                src={assets.moon_icon} className='size-8.5 p-1.5 border border-gray-500 rounded-full' />
            )}
</button>

    </div>
  )
}

export default ThemeToggleBtn