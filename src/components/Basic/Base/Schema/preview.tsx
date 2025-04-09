
import { createBehavior, createResource } from '@designable/core'
import { observer } from '@formily/react'
import { DnFC } from '@designable/react'

export const Schema: DnFC<{}> = observer(
  (props) => {
    return (
      <>
        {props.children}
      </>
    )
  }
)

Schema.Behavior = createBehavior({
  name: 'Schema',
  selector: 'Schema',
  designerProps(node) {
    return {
      draggable: !node.isRoot,
      cloneable: !node.isRoot,
      deletable: !node.isRoot,
      droppable: true,
      propsSchema: {
        type: 'object',
        properties: {
          // ...(AllSchemas.FormLayout.properties as any),
          // style: AllSchemas.CSSStyle,
        },
      },
      defaultProps: {
        labelCol: 6,
        wrapperCol: 12,
      },
    }
  },
  designerLocales: {
    'zh-CN': {
      title: '根模版',
    }
  }
  // designerLocales: AllLocales.Form,
})

Schema.Resource = createResource({
  elements: [
    {
      componentName: 'Schema',
    },
  ],
})
