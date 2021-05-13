import React, {useState} from 'react';
import AbstractQuickEdit from '../../src';
import 'antd/dist/antd.css';
import '../index.less';

export default {
    title: 'Introduction',
};

export const Introduction = () => {
    return (
        <div className="doc-root">
            <p align="middle">
                <img src="https://user-images.githubusercontent.com/12672355/85242194-e59f9880-b470-11ea-84f1-b43810f20b29.png" />
            </p>
            <p align="middle">
                A simple utility to create quick edit component.
                <img src="https://travis-ci.com/nick-ChenZe/AbstractQuickEdit.svg?branch=master"></img>
                <img src="https://codecov.io/gh/nick-ChenZe/AbstractQuickEdit/branch/master/graph/badge.svg"></img>
            </p>

            <p align="middle">
                <a href="https://github.com/nick-ChenZe/AbstractQuickEdit" target="_blank">
                    <button class="button">Github</button>
                </a>
                <a href="https://github.com/nick-ChenZe/AbstractQuickEdit" target="_blank">
                    <button class="button">integrate Build-in</button>
                </a>
                <a href="https://github.com/nick-ChenZe/AbstractQuickEdit" target="_blank">
                    <button class="button">integrate Antd</button>
                </a>
            </p>
            <h2>🤔 Why Quick Edit</h2>
            <p>
                For a long time in the past, I was thinking about a question that whether the interactive scene of quick
                editing exactly exists or not. In the real world, we can set the attrbute to `disabled` of controls with
                some extra styles to customize a editable field.
            </p>
            <p>
                That make sense, but something different is switching between display UI and editing UI can make user
                more awared of what he/she is doing right now. That will make some side effect, such as validate input
                or save it in remote.
            </p>
            <p>Another words, the interactive scene of quick edit has some same behavior in common.</p>
            <ol>
                <li>
                    <p>
                        In switch scene, such as making the component focused when user clicked it, if there is a
                        select, the component should auto open the dropdown panel when user clicked.
                    </p>
                </li>
                <li>
                    <p>
                        In toggle scene, such as saving user input when user click outside of input or pressing `Enter`
                        of keyboard. Another case is when user pressed `Esc`, the control will exit the edit mode, and
                        restore the original value. After that, all the data is same as before.
                    </p>
                </li>
            </ol>
            <hr />
            <h2>🤩 What's more</h2>
            <p>
                `AbstractQuickEdit` will make the component accessible, so you can focus field by press 'Tab' of
                keyboard and press `Enter` in the edit mode. Then you're free to type some words or press direction key
                `Up` and `Down` to choose a select option. Finally, press `Enter` again to finish the edit ride. That's
                awesome, right?
            </p>
        </div>
    );
};

interface Props {
    id?: string;
    className?: string;
    type?: string;
}

const Input = AbstractQuickEdit.register('input', {
    defaultEditComponentProps: {
        autoFocus: true,
    },
});

const Select = AbstractQuickEdit.register('select');

const identity = e => String(e);
const transformValue = e => e.target.value;
const displayColor = color => <div style={{backgroundColor: `${color || '#000'}`, height: 23, width: 40}}></div>;
export const IntegrateBuildInComponent = () => {
    const [value, setValue] = useState('Lorem ipsum');
    const [selectedValue, setSelectedValue] = useState('apple');
    const [date, setDate] = useState(new Date());
    const [color, setColor] = useState('');
    const [number, setNumber] = useState(0);

    return (
        <div className="doc-root demo">
            <h2>Demo: Integrate Browser Build-in Component with AbstractQuickEdit</h2>
            <hr></hr>
            <div className="container">
                <label htmlFor="input">
                    Input:
                    <Input
                        id="input"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        display={identity}
                        transformValue={transformValue}
                        value={value}
                        onChange={setValue}
                    />
                </label>
                <label htmlFor="number">
                    Number Input:
                    <Input
                        id="number"
                        type="number"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        display={identity}
                        transformValue={transformValue}
                        value={number}
                        onChange={setNumber}
                    />
                </label>
                <label htmlFor="select">
                    Select:
                    <Select
                        id="select"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        display={identity}
                        value={selectedValue}
                        onChange={setSelectedValue}
                        transformValue={transformValue}
                    >
                        <option value="apple">Apple</option>
                        <option value="orange">Orange</option>
                    </Select>
                </label>
                <label htmlFor="datepicker">
                    Datepicker:
                    <Input
                        id="datepicker"
                        type="date"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        display={identity}
                        value={date}
                        onChange={setDate}
                    />
                </label>
                <label htmlFor="color">
                    ColorPicker:
                    <Input
                        id="color"
                        type="color"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        transformValue={transformValue}
                        display={displayColor}
                        value={color}
                        onChange={setColor}
                    />
                </label>
            </div>
        </div>
    );
};

export const IntergrateAntdComponent = () => {
    const [value, setValue] = useState('Lorem ipsum');
    const [selectedValue, setSelectedValue] = useState('apple');
    const [date, setDate] = useState(new Date());
    const [color, setColor] = useState('');
    const [number, setNumber] = useState(0);

    return (
        <div className="doc-root demo">
            <h2>Demo: Integrate Ant Design Component with AbstractQuickEdit</h2>
            <hr></hr>
            <div className="container">
                <label htmlFor="input">
                    Input:
                    <Input
                        id="input"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        display={identity}
                        transformValue={transformValue}
                        value={value}
                        onChange={setValue}
                    />
                </label>
                <label htmlFor="number">
                    Number Input:
                    <Input
                        id="number"
                        type="number"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        display={identity}
                        transformValue={transformValue}
                        value={number}
                        onChange={setNumber}
                    />
                </label>
                <label htmlFor="select">
                    Select:
                    <Select
                        id="select"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        display={identity}
                        value={selectedValue}
                        onChange={setSelectedValue}
                        transformValue={transformValue}
                    >
                        <option value="apple">Apple</option>
                        <option value="orange">Orange</option>
                    </Select>
                </label>
                <label htmlFor="datepicker">
                    Datepicker:
                    <Input
                        id="datepicker"
                        type="date"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        display={identity}
                        value={date}
                        onChange={setDate}
                    />
                </label>
                <label htmlFor="color">
                    ColorPicker:
                    <Input
                        id="color"
                        type="color"
                        className="system-input"
                        wrapClassName="system-input-wrapper"
                        transformValue={transformValue}
                        display={displayColor}
                        value={color}
                        onChange={setColor}
                    />
                </label>
            </div>
        </div>
    );
};
