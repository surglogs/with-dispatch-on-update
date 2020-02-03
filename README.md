# withDispatchOnUpdate

[![Build Status](https://travis-ci.org/surglogs/with-dispatch-on-update.svg?branch=master)](https://travis-ci.org/surglogs/with-dispatch-on-update)

withDispatchOnUpdate is a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html) that allows you to conditionally dispatch a [Redux](https://redux.js.org/) [action](https://redux.js.org/basics/actions)

## Instalation

`npm i @surglogs/with-dispatch-on-update`

**Import:**

```js
import withDispatchOnUpdate from '@surglogs/with-dispatch-on-update'
```

## What is this library good for?

Often you need to dispatch an action in your component (usually to call API or navigate to other screen) when some situation arises (missing data, incoming props changed somehow etc.). The question is: where and how should you do this? We created a higher order component that helps to achieve that.

## Example

Following the [classic example app](http://todomvc.com/), we will create a component that fetches todos if necessary and show it to the user.

> We need to tweak our Redux store a little bit to handle asynchronous actions. To achieve that we use [Redux Promise Middleware](https://github.com/pburtchaell/redux-promise-middleware). You can use it too if want, but you are encouraged to use any other solution, which allows you to get the pending state of API call.

### Action

We will start by defining our action to fetch todos:

```js
// action

import api from './api'

export const LOAD_TODOS = 'LOAD_TODOS'

export const loadTodos = () => {
  const promise = api.getTodos()

  return {
    type: LOAD_TODOS,
    payload: promise,
  }
}
```

Our payload is in form of a Promise - to be able to handle such an action with ease, we use the aforementioned [Redux Promise Middleware](https://github.com/pburtchaell/redux-promise-middleware).

### Reducer

Next we move on to define our reducer:

```js
//reducer

const initialState = {
  todos: null,
  pending: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TODOS_PENDING:
      return { ...state, pending: true }
    case LOAD_TODOS_FULLFILLED:
      const { todos } = action.payload
      return { todos, pending: false }
    default:
      return state
  }
}
```

[Redux Promise Middleware](https://github.com/pburtchaell/redux-promise-middleware) helps us here to distinguish between two states - API call was fired (that is the `LOAD_TODOS_PENDING` action) and API call returned successfully (`LOAD_TODOS_FULLFILLED` action).

As you can see, we are storing the `pending` state of the API call. It will come handy in the component itself.

### Component

Finally, we will write our component:

```js
// component

import { connect } from 'react-redux'
import { compose } from 'redux'

import TodoList from '../components/TodoList'

const shouldLoadTodos = (state, props) => {
  const todos = state.todos
  const isTodosRequestPending = state.pending

  return !todos && !isTodosRequestPending
}

const mapStateToProps = (state, props) => ({
  todos: state.todos,
})

const VisibleTodoList = compose(
  withDispatchOnUpdate({
    action: loadTodos,
    condition: shouldLoadTodos,
  }),
  connect(mapStateToProps),
)(TodoList)

export default VisibleTodoList
```

In `connect(mapStateToProps)` we get the todos from the store that we want to show to the user.

The fetching of todos is managed by our HOC `withDispatchOnUpdate`

```js
withDispatchOnUpdate({
  action: loadTodos,
  condition: shouldLoadTodos,
})
```

We only need to provide the `action` that should be dispatched, and `condition` function that tells whether the action should be dispatched. Our condition function, which is here called `shouldLoadTodos`, gets both state and props and returns a `Boolean`. In our example, the condition is: todos do not exist in the store and the API call is not pending. Whenever this condition is fullfilled, the action `loadTodos` is dispatched.

## Passing arguments to action

We will extend our previous example a little bit. Let's say our app now can have multiple todo lists (shopping list, bucket list, movies to watch etc.). User can choose a list and we need to fetch the right todos.

We have to adjust our action that fetches the todos:

```js
export const loadTodos = listId => {
  const promise = api.getTodos(listId)

  return {
    type: LOAD_TODOS,
    payload: promise,
  }
}
```

Now we have to pass the `listId` to the action somehow. How to do that?

### Passing argument via props

Let's pretend we passed the listId to the component. In that case we will adjust our data loading like this:

```js
withDispatchOnUpdate({
  action: loadTodos,
  condition: shouldLoadTodos,
  args: ['listId']
}),
```

By writing `args: ['listId']` we say that the first argument is a prop with name `listId`. That was pretty easy!

> However if the `listId` was `null` or `undefined`, the action won't be dispatched. This is on purpose since you usually do not want to dispatch an action if some argument is missing - which usually happens when the value is `null` or `undefined`. If you don't want this behaviour you can pass a mapping function instead of a string - read on!

Alternatively, you can pass a function that maps the props to value:

```js
const listIdMapper = (props) => props.listId

...

withDispatchOnUpdate({
  action: loadTodos,
  condition: shouldLoadTodos,
  args: [listIdMapper]
}),
```

It is up to you which method you prefer. Passing a string is shorter, but passing a function is more flexible - you can for example provide a default value.

You can of course pass more than one argument to the action. Take a look at one more example:

```js
withDispatchOnUpdate({
  action: loadData,
  condition: shouldLoadData,
  args: [
    'a',
    (props) => props.b || [], // if there is no value, default to empty array
    'c'
  ]
}),
```

### Passing argument from store

Now let's pretend our `listId` is stored in the store. We might get the prop using `connect` and then write `withDispatchOnUpdate` the same way as last time:

```js
compose(
  connect((state, props) => ({
    listId: state.listId
  })),
  withDispatchOnUpdate({
    action: loadTodos,
    condition: shouldLoadTodos,
    args: ['listId']
  }),
  ...
)
```

However, there is shorter way. You can use `connector`, to specify the props that you need to get from the store:

```js
compose(
  withDispatchOnUpdate({
    action: loadTodos,
    condition: shouldLoadTodos,
    args: ['listId'],
    connector: {
      listId: (state, props) => state.listId
    }
  }),
  ...
)
```

It is just a shortcut for using connect, therefore use whatever you like more.

## Options

The provided action will be fired only if none of the arguments in the `args` array is `null` or `undefined`. If you want to prevent this, you can pass an optional param `shouldRequireAllProps: false`:

```js
withDispatchOnUpdate({
  action: myAction,
  condition: myCondition,
  args: ['a', 'b', 'c'],
  shouldRequireAllProps: false
})
```

Now the action will be fired even if `a`, `b` or `c` prop is `null` or `undefined` and `myCondition` is satisfied.
