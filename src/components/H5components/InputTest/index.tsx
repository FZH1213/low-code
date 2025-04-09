import { Input } from '@/components/base';




const InputTest: React.FC<{

}> = (props) => {
    console.info("InputTest", props)
    return (
        <>{"这是一个测试 组件 占位提示"}{props.placeholder}</>
    );
};

export default InputTest;
