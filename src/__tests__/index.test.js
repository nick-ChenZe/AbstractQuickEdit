import {shallow} from 'enzyme';
import AbstractQuickEdit from '../AbstractQuickEdit';

describe('test AbstractQuickEdit.register', () => {
    test('should render build-in input component correct', () => {
        const Input = AbstractQuickEdit.register('input');
        const input = shallow(<Input />);
        expect(input).toMatchSnapshot();
    });

    test('should render build-in input component in edit mode', () => {
        const onEditChange = jest.fn(x => x)
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
});
