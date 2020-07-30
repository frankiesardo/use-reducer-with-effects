# use-reducer-with-effects

> React Hook that colocates reducer and side effects

[![NPM](https://img.shields.io/npm/v/use-reducer-with-effects.svg)](https://www.npmjs.com/package/use-reducer-with-effects) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## What it does

It's pretty simple: your reducer can return additional data after it executes to signal it would like to run a side effect.

So instead of:

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}
```

And have your effect logic scattered everywhere in your app, you can write:

```jsx
function reducerWithEffects(state, action) {
  switch (action.type) {
    case 'increment':
      return { state: {count: state.count + 1}
               log: "Log important information"
               http: {url: "http://server.com", method: "post", params: {count: state.count + 1}, callback: 'after-increment'}}
    case 'after-increment':
      return (action.payload.success) ? { documentTitle: "Success" } : { documentTitle: "Error!" }
    case 'decrement':
      return { state: {count: state.count - 1}
               anotherSideEffect: {dataNeededByThatSideEffect: 1} }
    case 'debug':
      return { log: "You can omit the state: key if the state doesn't need to change" }      
    default:
      throw new Error();
  }
}
```

Where `http`, `log`, `documentTitle` and `anotherSideEffect` are side effects that (you guessed it right!) call a server, log info, update the page title or do whatever type of side effect you like.

Your reducer is still a pure function: data in and data out. Every side effect key has a data representation of what it needs to do.

Your application uses this hook passing a handlers map. The handlers map knows how to execute the side effects that you returned in your reducerWithEffects.

```jsx
const handlers = 
{ log: (dispatch, payload) => console.log(payload), 
  documentTitle: (dispatch, payload) => document.title = payload, 
  http: (dispatch, {callback, url, params}) => "...Do an http call and then dispatch({type: callback, payload: result})" }
// etc..  

const initialState = {count: 0}

function App() {
  const [state, dispatch] = useReducerWithEffects(reducerWithEffects, handlers, initialState)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
}
```

Check the `/example` folder for a runnable prototype or visit this [sandbox](https://codesandbox.io/s/use-reducer-with-effects-3fnlv)

## Why it does

While this is a tiny library in terms of code, it packs a big, opinionated view on how to structure a React application.

If you use this library you probably like to keep all state in one place. And if you like to keep all state in one place you probably like to keep all state transitions in one place (your reducer). If you describe all state transitions in one place then why not taking the extra leap and specify all side effects in one place, so for every user action there is a data representation of what the app is going to do (change the state, call a server, etc.).

Those that use this library tend to:
- Keep the state all in one place (the top level state)
- Pass down the dispatch function inside a context
- Update the relevant bits of the state as the user dispatches actions
- Pass down all the state via props into the components
- Every component is a pure/memoized component if possible

While you don't have to do all of the above, this library fits in that philosophy of a simple, clear and maintainable application where components only care about displaying a UI given some props and the reducer controls what's happening in your app.

## When it does

When you install it like this:

```bash
npm install --save use-reducer-with-effects
```

Bonus points: you can use it with [Clojurescript](https://github.com/frankiesardo/shadow-native/blob/master/src/main/example/app.cljs#L8) too!

## License

MIT © [frankiesardo](https://github.com/frankiesardo)

## Credit

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).

Inspiration for the shape of the returned data is taken from the great [citrus library](https://github.com/clj-commons/citrus#usage).