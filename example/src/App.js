import React from 'react'
import { useMyHook } from 'use-reducer-with-effects'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App