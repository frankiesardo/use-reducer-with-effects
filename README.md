# use-reducer-with-effects

> React Hook that colocates reducer and side effects

[![NPM](https://img.shields.io/npm/v/use-reducer-with-effects.svg)](https://www.npmjs.com/package/use-reducer-with-effects) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-reducer-with-effects
```

## Usage

```jsx
import React, { Component } from 'react'

import { useMyHook } from 'use-reducer-with-effects'

const Example = () => {
  const example = useMyHook()
  return (
    <div>{example}</div>
  )
}
```

## License

MIT © [frankiesardo](https://github.com/frankiesardo)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
