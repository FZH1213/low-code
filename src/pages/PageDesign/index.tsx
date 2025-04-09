import 'antd/dist/antd.less';
import React, { useMemo } from 'react';
import {
  Designer,
  DesignerToolsWidget,
  ViewToolsWidget,
  Workspace,
  OutlineTreeWidget,
  ResourceWidget,
  HistoryWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from '@designable/react';
import { SettingsForm, setNpmCDNRegistry } from '@designable/react-settings-form';
import { createDesigner, GlobalRegistry, Shortcut, KeyCode } from '@designable/core';
import { LogoWidget, ActionsWidget } from './widgets';
import { saveSchema } from './service';
import './index.less';
setNpmCDNRegistry('//unpkg.com');

import {
  PcButton,
  PcCard,
  PcInput,
  PcTextArea,
  PcUpload,
  PcTree,
  PcCheckbox,
  PcRadio,
  PcSelect,
  PcTreeSelect,
  PcDatePicker,
  PcRate,
  PcTable,
  PcCol,
  PcRow,
  PcG2Bar,
  PcG2Column,
  PcG2Gauge,
  PcG2Line,
  PcG2Liquid,
  PcG2Pie,
  PcVArea,
  PcVDualAxes,
  PcVScatter,
  PcVRose,
  PcSpace,
  PcModal,
  PcDrawer,
  PcButtonLink,
  PcLayout,
  FileImport,
  PcList,
  PcListButtonLink,
  PcTabs,
  // PcAutoComplete,
  PcSwitch,
  PcCascader,
  // PcStatistic,
  PcDisplaysList,
  PcDisplaysStatistic,
  // PcCarousel,
  PcImage,
  PcVideo,
  PcProgress,
  PcAlert,
  PcDotMap,
  PcCarouselV2,
  PcFormGrid,
  PcDisplayText,
  PcAddData,
  PcCarousel3d,
} from '@/components/Basic/PC/preview';
import { Schema, BaseForm } from '@/components/Basic/Base/preview';
GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Commons: '通用组件',
      Layouts: '布局组件',
      Displays: '展示组件',
    },
  },
});
console.log(history);
const App = () => {
  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              saveSchema(ctx.engine);
            },
          }),
        ],
        rootComponentName: 'Schema',
      }),
    [],
  );
  return (
    <div className="rooName">
      <Designer engine={engine}>
        <StudioPanel logo={<LogoWidget />} actions={<ActionsWidget />}>
          <CompositePanel>
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget
                title="sources.Inputs"
                sources={[
                  BaseForm,
                  PcInput,
                  PcTextArea,
                  PcRadio,
                  PcCheckbox,
                  PcSelect,
                  PcTreeSelect,
                  PcDatePicker,
                  PcRate,
                  PcUpload,
                  FileImport,
                  // PcAutoComplete,
                  PcSwitch,
                  PcCascader,
                  PcAddData,
                ]}
              />
              <ResourceWidget title="sources.Commons" sources={[PcButton, PcButtonLink, PcModal, PcDrawer]} />
              <ResourceWidget
                title="sources.Layouts"
                sources={[
                  PcCard,
                  PcRow,
                  PcCol,
                  PcSpace,
                  PcLayout,
                  PcList,
                  PcTabs,
                  PcCarouselV2,
                  PcFormGrid,
                  PcCarousel3d,
                ]}
              />
              <ResourceWidget
                title="sources.Displays"
                sources={[
                  PcTable,
                  PcDisplaysList,
                  PcG2Bar,
                  PcG2Column,
                  PcG2Gauge,
                  PcG2Line,
                  PcG2Liquid,
                  PcG2Pie,
                  PcVArea,
                  PcVDualAxes,
                  PcVScatter,
                  PcVRose,
                  PcTree,
                  // PcStatistic,
                  PcDisplaysStatistic,
                  PcImage,
                  PcVideo,
                  PcProgress,
                  PcAlert,
                  PcDotMap,
                  // PcCarousel,
                  PcDisplayText,
                ]}
              />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>
          <Workspace id="form">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget use={['DESIGNABLE']} />
              </ToolbarPanel>
              <ViewportPanel>
                <ViewPanel type="DESIGNABLE">
                  {() => (
                    <ComponentTreeWidget
                      components={{
                        Schema,
                        BaseForm,
                        PcButton,
                        PcModal,
                        PcDrawer,
                        PcTextArea,
                        PcCard,
                        PcInput,
                        PcCheckbox,
                        PcRadio,
                        PcSelect,
                        PcTreeSelect,
                        PcDatePicker,
                        PcRate,
                        PcUpload,
                        FileImport,
                        PcTable,
                        PcRow,
                        PcCol,
                        PcG2Bar,
                        PcG2Column,
                        PcG2Gauge,
                        PcG2Line,
                        PcG2Liquid,
                        PcG2Pie,
                        PcVArea,
                        PcVDualAxes,
                        PcVScatter,
                        PcVRose,
                        PcSpace,
                        PcButtonLink,
                        PcTree,
                        PcLayout,
                        PcList,
                        PcListButtonLink,
                        PcTabs,
                        // PcAutoComplete,
                        PcSwitch,
                        PcCascader,
                        // PcStatistic,
                        PcDisplaysList,
                        PcDisplaysStatistic,
                        PcImage,
                        PcVideo,
                        PcProgress,
                        PcAlert,
                        PcDotMap,
                        // PcCarousel,
                        PcCarouselV2,
                        PcFormGrid,
                        PcDisplayText,
                        PcAddData,
                        PcCarousel3d,
                      }}
                    />
                  )}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <SettingsPanel title="panels.PropertySettings">
            <SettingsForm />
          </SettingsPanel>
        </StudioPanel>
      </Designer>
    </div>
  );
};
export default App;
// ReactDOM.render(<App />, document.getElementById('root'))
