import React from 'react'
import ugh from 'ugh'

export default class SafeParent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      parentContextKey: null
    }

    this.ref = React.createRef()
  }

  componentDidMount () {
    const { Component, providerProps } = this.props
    const keys = Object.keys(providerProps)
    console.log('keys', keys)

    if (this.ref.current) {
      const parentContextKey = keys.find(key => {
        const parentMap = this.ref.current.closest(`#${key}`)

        return parentMap?.id
      })

      if (!parentContextKey) ugh.error(`Could not find parent <Map> for ${Component.name} during context lookup (tip: make sure portals render as children of their map.getTarget() parent)`) // eslint-disable-line max-len

      this.setState({ parentContextKey })
    }
  }

  render () {
    const { Component, inlineProps, providerProps } = this.props
    const { parentContextKey } = this.state
    const contextKey = inlineProps._ol_kit_context_id || parentContextKey
    const relativeProviderProps = providerProps[contextKey]
    const filteredProviderProps = { ...relativeProviderProps }
    console.log('SafeParent', Component, inlineProps, providerProps)

    if (Component.propTypes) {
      // filter out any props from context that do not need to get passed to this wrapped component
      Object.keys(providerProps).forEach(key => {
        if (!Component.propTypes[key]) delete filteredProviderProps[key]
      })
    }

    return (
      !!contextKey ? (
        <Component {...filteredProviderProps} {...inlineProps} />
      ):(
        <div ref={this.ref}>{`Could not find parent <Map> for ${Component.name} during context lookup`}</div>
      )
    )
  }
}