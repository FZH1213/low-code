// import {
//   Button,
//   Form,
//   Input,
//   InputNumber,
//   message,
//   Modal,
//   Radio,
//   Select,
//   Space,
//   Divider,
//   TreeSelect,
// } from '../../../../components/base';
import React, { forwardRef, useEffect, useState } from 'react';
import { addMenu, updateByMenuId, removeByMenuId, addMenuH5, removeByMenuIdH5, updateByMenuIdH5 } from './service';
import { judgeSucessAndGetMessage } from '@/utils/requestUtil';
import { history } from 'umi';
import { GLOBAL_VALUE } from '@/utils/globalValue';
import styles from './style/index.less';
import {
  PlusOutlined,
  PropertySafetyFilled,
  DeleteOutlined,
  SyncOutlined,
  LoadingOutlined,
  PlaySquareOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Divider,
  TreeSelect,
  Upload
} from 'antd';

export interface ComponentProps {
  /**
   * 菜单信息
   */
  infoData?: any;

  /**
   *菜单树
   */
  menuTree?: any[];

  /**
   * 操作成功时回调
   */
  opoerateSuccessCallback?: (operate: number) => void;
}

const { TreeNode } = TreeSelect;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 18 },
};

const prefixSelector = (
  <Form.Item name="scheme" noStyle initialValue="/">
    <Select className={styles.formSelect}>
      <Select.Option value="/">/</Select.Option>
      <Select.Option value="http://">http://</Select.Option>
      <Select.Option value="https://">https://</Select.Option>
    </Select>
  </Form.Item>
);

const afterSelector = (
  <Form.Item name="target" noStyle initialValue="_self">
    <Select className={styles.formNew}>
      <Select.Option value="_self">窗口内</Select.Option>
      <Select.Option value="_blank">新窗口</Select.Option>
    </Select>
  </Form.Item>
);


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('请上传JPG/PNG文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片不超过2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const FunctionComponent: React.FC<ComponentProps> = forwardRef(
  ({ infoData, menuTree, opoerateSuccessCallback }, ref) => {
    const [form] = Form.useForm();
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    useEffect(() => {
      console.log('infoData =>', infoData);
      if (infoData && infoData.menuId) {
        form.setFieldsValue(infoData);
      } else {
        form.resetFields();
      }
    }, [infoData]);

    const loop = (data: any[]) => {
      return (
        data?.map((item) => (
          <TreeNode key={item.menuId} value={item.menuId} title={item.menuName}>
            {item.children && loop(item.children || [])}
          </TreeNode>
        )) || []
      );
    };
    // 防多次点击 置灰
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [delDisabled, setDelDisabled] = useState<boolean>(false);
    const [prevload, setprevload] = useState<boolean>(false);

    const [loading, setloading] = useState<boolean>(false);
    const [imageUrl, setimageUrl] = useState<string>('');
    const [iconUrl, setIconUrl] = useState<string>('');


    const loopTree = (data: any[], root: boolean) => {
      if (root) {
        return [<TreeNode key="0" value="0" title="无" />, ...loop(data)];
      }
      return loop(data);
    };

    const handleAdd = async (values: any) => {
      setBtnLoading(true);
      const [flag, msg] = await judgeSucessAndGetMessage(addMenuH5({ ...values, menuId: undefined }));
      if (flag) {
        message.success(msg || '操作成功');
        if (opoerateSuccessCallback) opoerateSuccessCallback(1);
      } else {
        message.error(msg || '操作失败');
      }
      setBtnLoading(false);
    };

    const handleUpdate = async (values: any) => {
      setBtnLoading(true);
      Modal.confirm({
        title: `确定保存菜单名称为【${values.menuName}】的配置吗？`,
        icon: <ExclamationCircleOutlined />,
        onOk: async () => {
          const [flag, msg] = await judgeSucessAndGetMessage(updateByMenuIdH5(values));
          if (flag) {
            message.success(msg || '操作成功');
            if (opoerateSuccessCallback) {
              opoerateSuccessCallback(2);
            }
          } else {
            message.error(msg || '操作失败');
          }
        },
      });
      setBtnLoading(false);
    };

    const handleOk = (operate: number) => {
      setSubmitDisabled(true);
      setTimeout(() => {
        setSubmitDisabled(false);
      }, 2000);
      form.validateFields().then((values) => {
        values.icon = iconUrl
        if (operate === 2 && values.menuId && values.menuId !== 0) {
          // 后台限制以下字段必填
          let v = {
            ...values,
            isCommon: '',
            isPersist: '',
            scheme: '',
            serviceId: '',
            target: '_blank',
          }
          handleUpdate(v);
        } else {
          handleAdd(values);
        }
      });
    };

    const handleDelete = () => {
      setDelDisabled(true);
      setTimeout(() => {
        setDelDisabled(false);
      }, 2000);
      const data = form.getFieldsValue();
      if (data.menuName) {
        Modal.confirm({
          title: `确定删除【${data.menuName}】吗？`,
          icon: <ExclamationCircleOutlined />,
          onOk: async () => {
            if (data.menuId) {
              const [flag, msg] = await judgeSucessAndGetMessage(removeByMenuIdH5(data.menuId));
              if (flag) {
                message.success(msg || '操作成功');
                if (opoerateSuccessCallback) opoerateSuccessCallback(3);
              } else {
                message.error(msg || '操作失败');
              }
            }
          },
        });
      } else {
        message.error('请选择需要删除菜单');
      }
    };

    const handleChange = info => {
      if (info.file.status === 'uploading') {
        setloading(true)
        return;
      }
      if (info.file.status === 'done') {
        let { data } = info.file.response
        setIconUrl(data.fileUrlView)
        getBase64(info.file.originFileObj, imageUrl => {
          setimageUrl(imageUrl)
          setloading(false)
        });
      }
    };

    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <>
        <>
          <Button
            loading={submitDisabled}
            type="primary"
            disabled={submitDisabled}
            onClick={() => handleOk(1)}
            icon={<PlusOutlined />}
          >
            添加
          </Button>
          <Divider type="vertical" />
          <Button
            loading={delDisabled}
            type="primary"
            danger
            onClick={() => handleDelete()}
            disabled={delDisabled}
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
          {/* <Divider type="vertical" />
          <Button
            loading={prevload}
            type="dashed"
            // danger
            onClick={() => history.push('/system-management/menu-page-H5')}
            disabled={prevload}
            icon={<PlaySquareOutlined />}
          >
            预览
          </Button> */}
        </>
        <Form
          // {...layout}
          ref={ref}
          form={form}
          layout="vertical"
          className={styles.menuInfoFrom}
        >
          <Form.Item name="menuId" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="parentId" label="上级菜单">
            <TreeSelect showSearch treeNodeFilterProp="title" allowClear>
              {loopTree(menuTree || [], true)}
            </TreeSelect>
          </Form.Item>

          <Form.Item
            name="menuCode"
            label="菜单编码"
            rules={[
              { required: true, message: GLOBAL_VALUE.INPUT_PROMPT('菜单编码', 100), max: 100 },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="menuName"
            label="菜单名称"
            rules={[
              { required: true, message: GLOBAL_VALUE.INPUT_PROMPT('菜单名称', 20), max: 20 },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="path"
            label="页面地址"
          // rules={[
          //   { required: false, message: GLOBAL_VALUE.INPUT_PROMPT('页面地址', 100), max: 100 },
          // ]}
          >
            <Input
            // addonBefore={prefixSelector}
            // addonAfter={afterSelector}
            />
          </Form.Item>
          <Form.Item
            name="icon"
            label="图标"
          // rules={[
          //   { required: true, message: GLOBAL_VALUE.INPUT_PROMPT('图标', 100), max: 100 },
          // ]}
          >
            <Upload
              // action="/api/file/fileInfo/upload"
              // listType="picture-card"
              // fileList={fileList}
              // onPreview={handlePreview}
              // onChange={handleChange}
              // beforeUpload={beforeUploadAvatar}
              // maxCount={10}
              // data={{ btype: 'expertLibrary' }}
              // headers={{
              //     Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
              // }}

              // data={{ btype: 'expertLibrary' }}
              headers={{
                Authorization: `Bearer ${window.localStorage.getItem('access_token')}`,
              }}
              // name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="/api/file/fileInfo/uploadAppMenuImage"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item name="priority" label="优先级" initialValue={0}>
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item name="status" label="状态"
            rules={[
              { required: true, message: '请选择是否启用' },
            ]}
          >
            <Radio.Group>
              <Radio.Button key="0" value={0}>
                禁用
              </Radio.Button>
              <Radio.Button key="1" value={1}>
                启用
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="menuDesc" label="描述">
            <Input.TextArea showCount maxLength={GLOBAL_VALUE.TEXTAREA_MAX} />
          </Form.Item>

          <Form.Item>
            <>
              <Button
                type="primary"
                loading={submitDisabled}
                disabled={submitDisabled}
                onClick={() => handleOk(2)}
              >
                保存
              </Button>
              <Divider type="vertical" />
              <Button
                loading={btnLoading}
                icon={<SyncOutlined />}
                onClick={() => form.resetFields()}
              >
                重置
              </Button>
            </>
          </Form.Item>
        </Form>
      </>
    );
  },
);

export default FunctionComponent;
