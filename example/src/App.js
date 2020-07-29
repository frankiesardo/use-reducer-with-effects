import React from 'react'
import { useReducerWithEffects } from 'use-reducer-with-effects'

const actionType = {
  LOGIN: "login",
  LOGIN_CALLBACK: "logingCallback",
  LOGOUT: "logout",
  LOGOUT_CALLBACK: "logoutCallback"
}

function reducerWithEffects(state, action) {
  switch (action.type) {
    case actionType.LOGIN:
      return {
        state: { ...state, isLoading: true },
        http: { url: "login-url", params: {}, callback: actionType.LOGIN_CALLBACK },
        log: action        
      }
    case actionType.LOGIN_CALLBACK:
      return {
        state: { ...state, isLoading: false, profile: action.payload.body.profile },
        log: action
      }
    case actionType.LOGOUT:
      return {
        state: { ...state, isLoading: true, profile: null },
        http: { url: "logout-url", params: {}, callback: actionType.LOGOUT_CALLBACK },
        log: action        
      }
    case actionType.LOGOUT_CALLBACK:
      return {
        state: { ...state, isLoading: false },
        log: action
      }
    default:
      throw action
  }
}

function http(dispatch, { callback, url, params }) {
  setTimeout(function () {
    console.log(`Calling server on ${url}`);
    dispatch(
      {
        type: callback,
        payload: {
          success: true,
          status: 200,
          body: { profile: { name: "Alice" } }
        }
      })
  }, 1000)
}

function log(dispatch, payload) {
  console.log("Logging..", payload)
}

const handlers = { log: log, http: http }
const initialState = { isLoading: false }

const DispatchContext = React.createContext();

const Home = React.memo(({ state }) => {
  const dispatch = React.useContext(DispatchContext)
  const { isLoading, profile } = state
  const onLogin = () => { dispatch({ type: actionType.LOGIN }) }
  const onLogout = () => { dispatch({ type: actionType.LOGOUT }) }

  return (
    <div>
      <button onClick={onLogin}>
        Login
        </button>
      <button onClick={onLogout}>
        Logout
        </button>
      {isLoading ? (<p> Loading... </p>)
        : profile ? (<p> Welcome, {profile.name} </p>)
          : (<p> Logged out </p>)}
    </div>
  )
})

function App() {
  const [state, dispatch] = useReducerWithEffects(reducerWithEffects, handlers, initialState)
  return (
    <DispatchContext.Provider value={dispatch}>
      <Home state={state} />
    </DispatchContext.Provider>
  )
}

export default App