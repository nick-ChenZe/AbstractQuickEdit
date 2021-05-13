import React, {useState, useCallback} from 'react';
import {Input as AntdInput, Select as AntdSelect} from 'antd';
import {withInfo} from '@storybook/addon-info';
import {withA11y} from '@storybook/addon-a11y';
import 'antd/dist/antd.css';
import AbstractQuickEdit from '../../src';

export default {
    title: 'Usage',
    decorators: [withInfo, withA11y],
    parameters: {
        info: {
            text: `
                # Hello world,
            `
        },
    },
};

const transformValue = e => e.target.value;

const AntInput = AbstractQuickEdit.register(AntdInput, {
    defaultEditComponentProps: {
        autoFocus: true,
    },
});

const AntSelect = AbstractQuickEdit.register(AntdSelect, {
    defaultEditComponentProps: {
        autoFocus: true,
    },
});

export const TextQuickEdit = () => {
    const [value, setValue] = useState('hello world');
    const computedDisplay = useCallback(
        value => {
            return `value:${value}`;
        },
        []
    );

    return (
        <>
        22222
            <AntInput display={computedDisplay} transformValue={transformValue} onChange={setValue} value={value} />
            <AntSelect display={computedDisplay} onChange={console.log} value={value}>
                <AntdSelect.Option value="hello">hello</AntdSelect.Option>
                <AntdSelect.Option value="world">world</AntdSelect.Option>
            </AntSelect>
        </>
    );
};
