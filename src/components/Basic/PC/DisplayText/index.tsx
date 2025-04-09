

/**
 * 展示文本框  todo感觉应该展示和输入合并，这里先简单处理
 *
 * @param {*} props
 * @return {*}
 */
interface PcDisplayTextProps {
  initialValue: string
}
export const PcDisplayText: React.FC<PcDisplayTextProps> = (props) => {
  return (
    <div style={{ ...props }}>
      {props.initialValue}
    </div>
  );
};
