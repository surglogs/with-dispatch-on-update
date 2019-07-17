import React from 'react'
import { mount, configure } from 'enzyme'
import sinon from 'sinon'
import { compose, withState, flattenProp } from 'recompose'
import Adapter from 'enzyme-adapter-react-16'

import withDispatchOnUpdate from '../index'

configure({ adapter: new Adapter() })

describe('withDispatchOnUpdate HOC', () => {
  it('calls action when component updates and condition is met', () => {
    // const component = sinon.spy(() => null)

    // const propsTracker = sinon.spy()
    // const StringConcat = compose(
    //   withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c' }),
    //   flattenProp('strings'),
    //   withDispatchOnUpdate(['a', 'b'], {
    //     foobar: props => {
    //       propsTracker(props)
    //       const { a, b } = props

    //       return a + b
    //     },
    //   }),
    // )(component)

    // mount(<StringConcat />)
    // const { updateStrings } = component.firstCall.args[0]
    // expect(component.lastCall.args[0].foobar).toBe('ab')
    // expect(component.calledOnce).toBe(true)
    // expect(propsTracker.callCount).toBe(1)
    // expect(propsTracker.lastCall.args[0]).toEqual({ a: 'a', b: 'b' })

    // // Does not re-map for non-dependent prop updates
    // updateStrings(strings => ({ ...strings, c: 'baz' }))
    // expect(component.lastCall.args[0].foobar).toBe('ab')
    // expect(component.lastCall.args[0].c).toBe('baz')
    // expect(component.calledTwice).toBe(true)
    // expect(propsTracker.callCount).toBe(1)

    // updateStrings(strings => ({ ...strings, a: 'foo', b: 'bar' }))
    // expect(component.lastCall.args[0].foobar).toBe('foobar')
    // expect(component.lastCall.args[0].c).toBe('baz')
    // expect(component.calledThrice).toBe(true)
    // expect(propsTracker.callCount).toBe(2)
  })

  // it('derives props when relevant props change with passAllProps', () => {
  //   const component = sinon.spy(() => null)

  //   const propsTracker = sinon.spy()
  //   const StringConcat = compose(
  //     withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c' }),
  //     flattenProp('strings'),
  //     withDispatchOnUpdate(
  //       ['a', 'b'],
  //       {
  //         foobar: props => {
  //           propsTracker(props)
  //           const { a, b } = props

  //           return a + b
  //         },
  //       },
  //       { passAllProps: true },
  //     ),
  //   )(component)

  //   mount(<StringConcat />)
  //   const { updateStrings } = component.firstCall.args[0]
  //   expect(component.lastCall.args[0].foobar).toBe('ab')
  //   expect(component.calledOnce).toBe(true)
  //   expect(propsTracker.callCount).toBe(1)
  //   expect(Object.keys(propsTracker.lastCall.args[0])).toEqual([
  //     'strings',
  //     'updateStrings',
  //     'a',
  //     'b',
  //     'c',
  //   ])

  //   // Does not re-map for non-dependent prop updates
  //   updateStrings(strings => ({ ...strings, c: 'baz' }))
  //   expect(component.lastCall.args[0].foobar).toBe('ab')
  //   expect(component.lastCall.args[0].c).toBe('baz')
  //   expect(component.calledTwice).toBe(true)
  //   expect(propsTracker.callCount).toBe(1)

  //   updateStrings(strings => ({ ...strings, a: 'foo', b: 'bar' }))
  //   expect(component.lastCall.args[0].foobar).toBe('foobar')
  //   expect(component.lastCall.args[0].c).toBe('baz')
  //   expect(component.calledThrice).toBe(true)
  //   expect(propsTracker.callCount).toBe(2)
  // })

  // it('derives multiple props that depend on previous derived props', () => {
  //   const component = sinon.spy(() => null)

  //   const propsTracker = sinon.spy()
  //   const StringConcat = compose(
  //     withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'great' }),
  //     flattenProp('strings'),
  //     withDispatchOnUpdate(['a', 'b', 'c'], {
  //       foobar: props => {
  //         propsTracker(props)
  //         const { a, b } = props

  //         return a + b
  //       },
  //       prefixedFoobar: props => {
  //         propsTracker(props)
  //         const { foobar, c } = props

  //         return c + ' ' + foobar
  //       },
  //     }),
  //   )(component)

  //   mount(<StringConcat />)
  //   expect(component.lastCall.args[0].foobar).toBe('ab')
  //   expect(component.lastCall.args[0].prefixedFoobar).toBe('great ab')
  //   expect(component.calledOnce).toBe(true)
  //   expect(propsTracker.callCount).toBe(2)
  // })
})
