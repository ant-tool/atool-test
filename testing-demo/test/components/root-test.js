import React from 'react';
import Root from '../../src/components/root';

describe('root', function () {

  it('should change name after change', () => {
    const root = TestUtils.renderIntoDocument(<Root/>);
    const input = TestUtils.findRenderedDOMComponentWithTag(root, 'input');
    const p = TestUtils.findRenderedDOMComponentWithClass(root, 'helloP');

    TestUtils.Simulate.change(input, {
      target: {
        value: 'test'
      }
    });

    TestUtils.Simulate.keyDown(input, {
      key: "Enter",
      keyCode: 13,
      which: 13
    });

    expect(p.textContent).to.be('Hello, test');

  });

});
