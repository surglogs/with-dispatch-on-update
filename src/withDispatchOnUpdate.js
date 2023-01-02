import { isPlainObject } from 'is-plain-object'
import all from 'ramda/src/all'
import isNil from 'ramda/src/isNil'
import map from 'ramda/src/map'
import not from 'ramda/src/not'
import pipe from 'ramda/src/pipe'
import reject from 'ramda/src/reject'
import { connect } from 'react-redux'

const isFunction = (value) => {
  return typeof value === 'function'
}

const hasRequiredProps = (props, keys) => {
  return pipe(
    reject(isFunction),
    map((prop) => props[prop]),
    all(pipe(isNil, not)),
  )(keys)
}

const getArgValues = (props, keys) => {
  return map((prop) => {
    return isFunction(prop) ? prop(props) : props[prop]
  }, keys)
}

const CONNECTED_PROPS = 'CONNECTED_PROPS'

const withDispatchOnUpdate = ({
  action,
  condition = () => true,
  args = [],
  connector = {},
  shouldRequireAllProps = true,
}) => {
  return connect(
    (state, props) => ({
      [CONNECTED_PROPS]: isPlainObject(connector) ? map((f) => f(state, props), connector) : connector,
      state,
    }),
    { boundAction: action },
    ({ [CONNECTED_PROPS]: connectedProps, state }, { boundAction }, props) => {
      const mergedProps = { ...props, ...connectedProps }
      if ((!shouldRequireAllProps || hasRequiredProps(mergedProps, args)) && condition(state, mergedProps)) {
        boundAction(...getArgValues(mergedProps, args))
      }

      return props
    },
  )
}

export default withDispatchOnUpdate
