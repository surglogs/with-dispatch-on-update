declare const withDispatchOnUpdate: ({
  action,
  condition,
  args,
  connector
}: {
  action: (...args: any[]) => any
  condition?: (state: any, props: any) => boolean
  args?: any[]
  connector?: object | ((state: any, props: any) => any)
}) => <T>(component: T) => T

export = withDispatchOnUpdate
