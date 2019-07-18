import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { mount, configure, render } from 'enzyme'
import sinon from 'sinon'
import { compose, withState } from 'recompose'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'

import withDispatchOnUpdate from '../index'

configure({ adapter: new Adapter() })

const MOCK_ACTION = 'MOCK_ACTION'
const CLEAR_STATE = 'CLEAR_STATE'
const CLEAR_TODOS = 'CLEAR_TODOS'
const SET_CAR = 'SET_CAR'

const buildComponentWithStore = (Component, store) => props => {
  return (
    <Provider {...{ store }}>
      <Component {...props} />
    </Provider>
  )
}

describe('withDispatchOnUpdate HOC', () => {
  it('calls action if and only if component updates and condition is met', () => {
    const component = sinon.spy(() => null)

    const mockAction = sinon.spy(() => {
      return {
        type: MOCK_ACTION,
        payload: {},
      }
    })

    const clearStateAction = () => {
      return {
        type: CLEAR_STATE,
        payload: {},
      }
    }

    const initialState = {
      todos: null,
    }

    const reducer = (state, action) => {
      switch (action.type) {
        case MOCK_ACTION:
          return { ...state, todos: [] }
        case CLEAR_STATE:
          return initialState
        default:
          return state
      }
    }

    const store = createStore(reducer, initialState)

    const shouldDispatchAction = (state, props) => {
      const { todos } = state
      const { showTodos } = props

      return !todos && showTodos === true
    }

    const Todos = compose(
      withState('showTodos', 'setShowTodos', false),
      withDispatchOnUpdate({
        action: mockAction,
        condition: shouldDispatchAction,
        connector: {
          todos: state => state.todos,
        },
      }),
    )(component)

    const ComponentWithStore = buildComponentWithStore(Todos, store)
    mount(<ComponentWithStore />)

    const { setShowTodos } = component.firstCall.args[0]
    expect(mockAction.callCount).toBe(0)

    setShowTodos('No, do not show them!')
    expect(mockAction.callCount).toBe(0)

    setShowTodos(true)
    expect(mockAction.callCount).toBe(1)
    expect(mockAction.lastCall.args).toEqual([])

    setShowTodos(false)
    setShowTodos(true)
    expect(mockAction.callCount).toBe(1)

    store.dispatch(clearStateAction())
    expect(mockAction.callCount).toBe(2)
  })

  it('passes action arguments correctly', () => {
    const component = sinon.spy(() => null)

    const mockAction = sinon.spy((car, name, page) => {
      return {
        type: MOCK_ACTION,
        payload: { car, name, page },
      }
    })

    const clearTodosAction = () => {
      return {
        type: CLEAR_TODOS,
        payload: {},
      }
    }

    const setCarAction = car => {
      return {
        type: SET_CAR,
        payload: { car },
      }
    }

    const initialState = {
      todos: null,
      car: undefined,
      name: 'Gatsby',
    }

    const reducer = (state, action) => {
      switch (action.type) {
        case MOCK_ACTION:
          return { ...state, todos: [] }
        case CLEAR_TODOS:
          return { ...state, todos: null }
        case SET_CAR:
          return { ...state, car: action.payload.car }
        default:
          return state
      }
    }

    const store = createStore(reducer, initialState)

    const shouldDispatchAction = (state, props) => {
      const { todos } = state
      const { showTodos } = props

      return !todos && showTodos === true
    }

    const Todos = compose(
      withState('showTodos', 'setShowTodos', false),
      withState('page', 'setPage', null),
      withDispatchOnUpdate({
        action: mockAction,
        condition: shouldDispatchAction,
        args: [({ car }) => car, 'name', 'page'],
        connector: {
          todos: state => state.todos,
          car: state => state.car,
          name: (state, props) => props.prefix + ' ' + state.name,
        },
      }),
    )(component)

    const ComponentWithStore = buildComponentWithStore(Todos, store)
    mount(<ComponentWithStore {...{ prefix: 'The Great' }} />)

    const { setShowTodos, setPage } = component.firstCall.args[0]
    expect(mockAction.callCount).toBe(0)

    setShowTodos(true)
    expect(mockAction.callCount).toBe(0)

    setPage(1)
    expect(mockAction.callCount).toBe(1)
    expect(mockAction.lastCall.args).toEqual([undefined, 'The Great Gatsby', 1])

    store.dispatch(setCarAction('Volkswagen Beetle'))
    expect(mockAction.callCount).toBe(1)

    store.dispatch(clearTodosAction())
    expect(mockAction.callCount).toBe(2)
    expect(mockAction.lastCall.args).toEqual([
      'Volkswagen Beetle',
      'The Great Gatsby',
      1,
    ])
  })

  it('renders children correctly', () => {
    const component = ({ children }) => {
      return (
        <div>
          I am a parent!
          {children}
        </div>
      )
    }

    const mockAction = sinon.spy(() => {
      return {
        type: MOCK_ACTION,
        payload: {},
      }
    })

    const initialState = {
      todos: null,
    }

    const reducer = (state, action) => {
      switch (action.type) {
        case MOCK_ACTION:
          return { ...state, todos: [] }
        case CLEAR_STATE:
          return initialState
        default:
          return state
      }
    }

    const store = createStore(reducer, initialState)

    const shouldDispatchAction = (state, props) => {
      const { todos } = state
      const { showTodos } = props

      return !todos && showTodos === true
    }

    const Todos = compose(
      withState('showTodos', 'setShowTodos', false),
      withDispatchOnUpdate({
        action: mockAction,
        condition: shouldDispatchAction,
        connector: {
          todos: state => state.todos,
        },
      }),
    )(component)

    const TodosWithChildren = props => {
      return (
        <Todos>
          <span>I am a child!</span>
        </Todos>
      )
    }

    const ComponentWithStore = buildComponentWithStore(TodosWithChildren, store)
    const renderedComponent = render(<ComponentWithStore />)

    expect(toJson(renderedComponent)).toMatchSnapshot()
  })
})
