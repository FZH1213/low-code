import React, { useMemo } from 'react'
import { createBehavior, createResource } from '@designable/core'
import { createForm } from '@formily/core'
import { observer } from '@formily/react'
import { Form as FormilyForm } from '@formily/antd'
import { usePrefix, DnFC } from '@designable/react'
// import { AllSchemas } from '../../schemas'
// import { AllLocales } from '../../locales'
import './styles.less'

export const Form: DnFC<React.ComponentProps<typeof FormilyForm>> = observer(
  (props) => {
    console.info("Formprops", props)
    const prefix = usePrefix('designable-form')
    const form = useMemo(
      () =>
        createForm({
          designable: true,
        }),
      []
    )
    return (

      <
        >
        {props.children}
      </>
    )
  }
)

Form.Behavior = createBehavior({
  name: 'Form',
  selector: (node) => node.componentName === 'Form',

  // designerProps(node) {
  //   return {
  //     draggable: !node.isRoot,
  //     cloneable: !node.isRoot,
  //     deletable: !node.isRoot,
  //     droppable: true,
  //     propsSchema: {
  //       type: 'object',
  //       properties: {
  //         // ...(AllSchemas.FormLayout.properties as any),
  //         // style: AllSchemas.CSSStyle,
  //       },
  //     },
  //     defaultProps: {
  //       labelCol: 6,
  //       wrapperCol: 12,
  //     },
  //   }
  // },
  // designerLocales: {
  //   'zh-CN': {
  //     title: '表单',
  //   }
  // }
})

Form.Resource = createResource({
  title: { 'zh-CN': '表单', 'en-US': 'Form' },
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-component': 'Form',
      },
    },
  ],
})
