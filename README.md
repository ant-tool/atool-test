# atool-test

## 特性

- 基于 mocha 实现, coverage summary|html 
- 内置 es2015, react, stage-0, jsdom, expect

```bash
$ atool-test
```

eg:
atool-test
```javascript
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';

describe('dom', () => {
  it('innerHTML', () => {
    class Foo extends Component {
      render() {
        return <div>1</div>;
      }
    }
    const dom = findDOMNode(renderIntoDocument( < Foo / > ))
    expect(dom.innerHTML).to.be('1')
  });
});
```

## todo

- coverage: ok
- testUtil
- eslint: ok
- travis
- ?