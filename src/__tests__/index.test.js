import {useState} from 'react';
import {shallow, mount} from 'enzyme';
import AbstractQuickEdit from '../AbstractQuickEdit';

const wait = time => new Promise(resolve => setTimeout(resolve, time));
const display = s => `value: ${s}`;
const transformValue = e => e.target.value;

describe('test AbstractQuickEdit.register', () => {
    test('should render build-in input component correct', () => {
        const Input = AbstractQuickEdit.register('input');
        const input = shallow(<Input />);
        expect(input).toMatchSnapshot();
    });

    test('should render build-in input component in edit mode', () => {
        const onEditChange = jest.fn(x => x);
        const Input = AbstractQuickEdit.register('input');
        const wrapper = shallow(<Input onEditChange={onEditChange} />);
        wrapper.find('.quick-edit').simulate('click');

        wrapper.update();

        expect(wrapper).toMatchSnapshot();
        expect(onEditChange.mock.calls.length).toEqual(1);

        wrapper.find('.quick-edit').simulate('keyDown', {keyCode: 27});
        expect(onEditChange.mock.calls.length).toEqual(2);

        wrapper.update();
        expect(wrapper).toMatchSnapshot();

        wrapper.find('.quick-edit').simulate('keyDown', {keyCode: 13});
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render build-in edit component by press enter', () => {
        const onEditChange = jest.fn(x => x);
        const Input = AbstractQuickEdit.register('input');
        const wrapper = shallow(<Input onEditChange={onEditChange} />);
        wrapper.find('.quick-edit').simulate('focus');
        wrapper.find('.quick-edit').simulate('keyDown', {keyCode: 13});
        wrapper.update();

        expect(wrapper).toMatchSnapshot();

        wrapper.find('.quick-edit').simulate('click');
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render disabled build-in edit component correct', () => {
        const onEditChange = jest.fn(x => x);
        const Input = AbstractQuickEdit.register('input');
        const wrapper = shallow(<Input disabled onEditChange={onEditChange} />);

        wrapper.find('.quick-edit').simulate('focus');
        wrapper.find('.quick-edit').simulate('keyDown', {keyCode: 13});
        wrapper.update();

        expect(wrapper).toMatchSnapshot();
    });

    test('should invoke onChange with text value', async () => {
        const DEFAULT_VALUE = 'Hello world';
        const onChange = jest.fn(x => expect(x).toEqual(DEFAULT_VALUE));

        const Input = AbstractQuickEdit.register('input');
        const wrapper = mount(<Input value="" onChange={onChange} transformValue={transformValue} />);

        wrapper.find('.quick-edit').simulate('click');
        wrapper.update();

        wrapper.find('input').simulate('change', {target: {value: DEFAULT_VALUE}});
        document.body.dispatchEvent(new Event('mouseup'));
        await wait(100);

        wrapper.update();
    });

    test('should render custom edit component corrent', () => {
        const DEFAULT_VALUE = 'Hello world';
        const CustomInput = props => {
            return <input {...props} />;
        };

        const Input = AbstractQuickEdit.register(CustomInput);
        const TextQuickEdit = () => {
            const [value, setValue] = useState(DEFAULT_VALUE);
            return <Input display={display} transformValue={transformValue} value={value} onChange={setValue} />;
        };

        const wrapper = shallow(<TextQuickEdit />);
        expect(wrapper).toMatchSnapshot();

        wrapper.find(Input).simulate('click');
        wrapper.update();

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Input).props().value).toEqual(DEFAULT_VALUE);
    });
});
