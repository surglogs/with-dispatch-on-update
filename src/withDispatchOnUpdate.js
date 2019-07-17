import isPlainObject from 'is-plain-object'
import { connect } from 'react-redux'
import map from 'ramda/src/map'
import all from 'ramda/src/all'
import pipe from 'ramda/src/pipe'
import not from 'ramda/src/not'
import isNil from 'ramda/src/isNil'
import reject from 'ramda/src/reject'

const isFunction = value => {
  return typeof value === 'function'
}

const hasRequiredProps = (props, keys) => {
  return pipe(
    reject(isFunction),
    map(prop => props[prop]),
    all(
      pipe(
        isNil,
        not,
      ),
    ),
  )(keys)
}

const getArgValues = (props, keys) => {
  return map(prop => {
    return isFunction(prop) ? prop(props) : props[prop]
  }, keys)
}

const CONNECTED_PROPS = 'CONNECTED_PROPS'

const withDispatchOnUpdate = ({
  action,
  condition = () => true,
  args = [],
  connector = {},
}) => {
  return connect(
    (state, props) => ({
      [CONNECTED_PROPS]: isPlainObject(connector)
        ? map(f => f(state, props), connector)
        : connector,
      state,
    }),
    { boundAction: action },
    ({ [CONNECTED_PROPS]: connectedProps, state }, { boundAction }, props) => {
      const mergedProps = { ...props, ...connectedProps }
      if (
        hasRequiredProps(mergedProps, args) &&
        condition(state, mergedProps)
      ) {
        boundAction(...getArgValues(mergedProps, args))
      }

      return props
    },
  )
}

export default withDispatchOnUpdate
