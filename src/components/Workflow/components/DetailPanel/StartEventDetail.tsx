import styles from "./index.less";
import React, { useContext, useState } from "react";
import { Button } from "antd";
import DataTableModal from "./DataTableModal";
import DefaultDetail, { DefaultProps } from './DefaultDetail';
import LangContext from "../../util/context";

const StartEventDetail: React.FC<DefaultProps>  = ({model,onChange,readOnly = false,}) => {
  if(model.eventContent===undefined){
    onChange('eventContent', []);
  }
  const { i18n , lang } = useContext(LangContext);
  const title = i18n['startEvent'];

  const [messageStartModalVisible,setMessageStartModalVisible] = useState(false);
  const messageCols = [
    { title: i18n['process.event.type'], dataIndex: 'event', editable:true,
      editor: { type: 'select',
      options: [
        {key: 'start',value:'start'},
        // {key: 'processInstance',value:'processInstance'},
      ]}
    },
    { title: i18n['process.event.content'], dataIndex: 'expression', editable:true },
  ];

  return (
    <>
    <div data-clazz={model.clazz} className={styles.propswrapper}>
      <div className={styles.panelTitle}>{title}</div>
      <div className={styles.panelBody}>
        <DefaultDetail model={model} onChange={onChange} readOnly={readOnly}/>
        <div className={styles.panelRow}>
            <div>
              {i18n['process.event']}：
              <Button className={styles.editBtn} disabled={readOnly} onClick={()=> setMessageStartModalVisible(true)}>{i18n['tooltip.edit']}</Button>
            </div>
        </div>
      </div>
    </div>
    <DataTableModal title={i18n['process.event']}
              lang={lang}
              newRowKeyPrefix="message"
              cols={messageCols}
              data={model.eventContent}
              visible={messageStartModalVisible}
              onOk={(d)=> {
                setMessageStartModalVisible(false);
                onChange('eventContent',d);
              }}
              onCancel={() => setMessageStartModalVisible(false)} />
    </>
  )
};

export default StartEventDetail;
