import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import uniqueId from 'lodash/uniqueId'
import { getWebAdminWindow, getWebAdminDocumentBody } from '_/utils/webadmin-dom'

import { Modal } from '@patternfly/react-core'

const PluginApiModal = ({
  children,
  title,
  className,
  modalId = `pluginApiModal-${uniqueId()}`,
  isOpen,
  onClose = () => {},
  ...rest
}) => {
  useEffect(() => {
    if (isOpen) {
      const targetWindow = getWebAdminWindow()
      const clonedStyles = []

      if (window !== targetWindow) {
        window.document.querySelectorAll('head style, head link[type="text/css"], head link[rel="stylesheet"]').forEach(style => {
          const cloned = style.cloneNode(true)
          cloned.setAttribute('data-style-for', modalId)
          clonedStyles.push(cloned)
          targetWindow.document.head.appendChild(cloned)
        })
      }

      return () => {
        clonedStyles.forEach(style => {
          targetWindow.document.head.removeChild(style)
        })
      }
    }
  }, [ isOpen ])

  // only pass down extra props to Modal that Modal explicitly knows about
  const restForModal = Object.fromEntries(Object.entries(rest).filter(
    ([key, value]) => Modal.propTypes.hasOwnProperty(key)
  ))

  return (
    <Modal
      id={modalId}
      title={title}
      className={className}
      isOpen={isOpen}
      onClose={onClose}
      appendTo={getWebAdminDocumentBody()}
      {...restForModal}
    >
      {children}
    </Modal>
  )
}

PluginApiModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  modalId: PropTypes.string,

  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func
}

export default PluginApiModal