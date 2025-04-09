import React, { useState, useEffect } from 'react';
import { Card, Tabs, Row, Col } from 'antd';
import styles from '../../ReportFormManagePage/styles.less';
import api from './service';
import { history } from 'umi';
// 选择模板
const { Meta } = Card;

const { TabPane } = Tabs;

const ChoiceTemplate: React.FC<{}> = (props: any) => {
  const [splList, setSplList] = useState([]);
  const [currentTab, setCurrentTab] = useState<number>(2);

  useEffect(() => {
    getSplList();
  }, []);

  const getSplList = async () => {
    let res = await api.fetchTempTypeList();
    if (res.code === 0) {
      setSplList(res.data);
    } else {
    }
  };

  return (
    <Tabs
      onChange={() => { setCurrentTab(2) }}
      type="card"
      className={styles.tabContainer}
      tabBarExtraContent={{ left: <span>所属类目：</span> }}
      style={{ background: 'white', padding: '0 20px', height: '83vh' }}
    >
      {splList.map((item: any, i: number) => (
        <TabPane tab={item.title} key={i} className={styles.tab}>
          <Row gutter={[16, 16]}>
            {(item.children.length &&
              item.children.map((ite: any, index: number) => (
                <Col span={12} key={index}>
                  <a
                    onClick={() =>
                      history.push({
                        pathname: '/manage-page/choice-sql',
                        query: { tplTypId: ite.value, title: ite.title },
                      })
                    }
                  >
                    <Card
                      hoverable={true}
                      cover={
                        <img
                          style={{ position: 'relative', width: 300, height: 220 }}
                          src={`/api/file/fileDown/downloadFileById?fileId=${ite.fileIds[0]}`}
                        />
                        // <img
                        //   alt=""
                        //   style={{ position: 'relative', width: 300, height: 220 }}
                        //   src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        // />
                      }
                    >
                      <Meta title={ite.title} description={ite.tplDesc} />
                    </Card>
                  </a>
                </Col>
              ))) ||
              null}
          </Row>
        </TabPane>
      ))
      }
    </Tabs >
  );
};

export default ChoiceTemplate;
