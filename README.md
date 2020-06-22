
<p align="middle" ><img src="https://user-images.githubusercontent.com/12672355/85242194-e59f9880-b470-11ea-84f1-b43810f20b29.png" /></p>
<h2 align="middle">AbstractQuickEdit</h2>
<p align="middle">A simple utility to create quick edit component.</p>

[![Build Status](https://travis-ci.com/nick-ChenZe/AbstractQuickEdit.svg?branch=master)](https://travis-ci.com/nick-ChenZe/AbstractQuickEdit)
[![codecov](https://codecov.io/gh/nick-ChenZe/AbstractQuickEdit/branch/master/graph/badge.svg)](https://codecov.io/gh/nick-ChenZe/AbstractQuickEdit)
[![npm version](https://badge.fury.io/js/react-abstract-quick-edit.svg)](https://badge.fury.io/js/react-abstract-quick-edit)
## ⚙️ Installation
### npm
```bash
$ npm install react-abstract-quick-edit
```

## 🚀 How to use

You can use `AbstractQuickEdit` to integrate browser built-in editing component easily.

```tsx
import AbstractQuickEdit from 'react-abstract-quick-edit';
import {useInputValue} from '@huse/input-value';

interface InputType {
    type?: string;
}

// `input` tag string will be registered to a quickEdit text editor.
// In this case, you should pass a generic type to inherit extra component pros type definition
const Input = AbstractQuickEdit.register<InputType>('input', {
    defaultEditComponentProps: {
        autoFocus: true,
    }
});

const Select = AbstractQuickEdit.register('select');

const App = () => {
    // `useInputValue` is a shortcut to pick target value from event.
    const textValue = useInputValue('');
    const selectedValue = useInputValue('');
    const [dateValue, setDateValeu] = useState('');

    const display = useCallback(
        value => {
            return `The value you edited: ${value}`;
        },
        []
    );

    return (
        `Text QuickEdit:`
        <Input display={display} {...textValue} />
        `Select QuickEdit`
        <Select display={display} {...selectedValue}>
            <Option value="apple">Apple</Option>
            <Option value="orange">Orange</Option>
        </Select>
        `Date QuickEdit`
        <Input type="date" display={display} value={dateValue} onChange={setDateValeu} />
    );
}
```

You can integrate any other social ui component library such as `ant-design` by `registerAll` 
```tsx
// quickEdit.ts
import AbstractQuickEdit from 'react-abstract-quick-edit';
import {Input, Select} from 'antd';

export default AbstractQuickEdit.registerAll(
    Input: [
        Input,
        {
            defaultEditComponentProps: {
                autoFocus: true,
            }
        }
    ],
    Select: [
        Select,
        {
            defaultEditComponentProps: {
                autoOpen: true,
            }
        }
    ]
);

// App.tsx
import {Input, Select} from './quickEdit';

const {Option} = Select;

const App = () => {
    const textValue = useInputValue('');
    const [selectedValue, setSelectedValue] = useState('');

    return (
        `Text QuickEdit:`
        <Input display={display} {...textValue} />
        `Select QuickEdit`
        <Select display={display} value={selectedValue} onChange={setSelectedValue}>
            <Option value="apple">Apple</Option>
            <Option value="orange">Orange</Option>
        </Select>
    );
}

See more example in docs.
```

## ⭐️ Show Your Support
Please give a ⭐️ if this project helped you!

## 👏 Contributing

If you have any questions or requests or want to contribute to `AbstractQuickEdit` or other packages, please write the [issue](https://github.com/nick-ChenZe/AbstractQuickEdit/issues) or give me a Pull Request freely.

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/nick-ChenZe/AbstractQuickEdit/issues) on GitHub.


## 📝 License

This project is [MIT](https://github.com/nick-ChenZe/AbstractQuickEdit/blob/master/LICENSE) licensed.

```
MIT License

Copyright (c) 2020 Ze Chen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
