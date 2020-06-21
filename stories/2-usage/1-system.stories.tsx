import React, {useState, useCallback} from 'react';
import AbstractQuickEdit from '../../src';

export default {
    title: 'SystemQuickEdit',
};

const transformValue = e => e.target.value;

interface Props {
    type?: string;
}

const Input = AbstractQuickEdit.register<Props>('input', {
    defaultEditComponentProps: {
        autoFocus: true,
    },
});

const Select = AbstractQuickEdit.register('select');

export const TextQuickEdit = () => {
    const [value, setValue] = useState('hello world');
    const computedDisplay = useCallback(
        value => {
            console.log(value);
            return `value:${value}`;
        },
        []
    );

    return (
        <>
            <Input display={computedDisplay} transformValue={transformValue} onChange={setValue} value={value} />
            <Input
                type="number"
                display={computedDisplay}
                transformValue={transformValue}
                onChange={setValue}
                value={value}
            />
            <Input
                type="date"
                display={computedDisplay}
                transformValue={transformValue}
                onChange={setValue}
                value={value}
            />
            <Select display={computedDisplay} transformValue={transformValue} onChange={setValue} value={value}>
                <option value="hello">world</option>
                <option value="hello2">world2</option>
            </Select>
        </>
    );
};
