import React, {FC, ComponentType, ReactNode, useCallback, useRef, useMemo, useState} from 'react';
import c from 'classnames';
import {useDerivedState} from '@huse/derived-state';
import {useClickOutside} from '@huse/click-outside';
import mapValues from 'lodash.mapvalues';
import {isEsc, isEnter} from './utils';

interface Options {
    defaultEditComponentProps?: {[key: string]: any};
}

interface ComponentProps {
    // Value of edit component
    value: any;
    // Internal onChange callback, invoke like user typing
    onChange: (...args: any[]) => void;
}

interface Props extends ComponentProps {
    // Decide which component should render, edit component or display.
    editing?: boolean;
    // Whether the component is disabled. If set `true`, nothing will happen when you click the display component.
    disabled?: boolean;
    // className of wrapper div.
    wrapClassName?: string;
    // Compute prop value to a render element.
    display: (value: any) => ReactNode;
    // There is a cycle when user edits the component, sometime the value bubbled not equal with value input.
    // `transformValue` with change the bubbled value to corrent format.
    // For example, the component like `DatePicker` emit a moment type by onChange callback.
    // In the mean time the value prop of `DatePicker` is string format like `YYYY-MM-DD`, this prop will be useful in this case.
    transformValue?: (...args: any[]) => any;
    // Not like the normal `onChange`, this callback will be invoked only by edit status switch `true` to `false`.
    onChange: (...args: any[]) => void;
    // Invoke when edit status changed.
    onEditChange?: (status: boolean) => void;
}

// `register` is a HOC, which make a edit component be capable of switching between display type and edit type.
// TODO:
// 1. should i defined ComponentType with props
const register = <T extends {} = {}, S extends {} = {}>(
    ComponentIn: ComponentType | string,
    options: Options = {}
): FC<Props & T> & S=> {
    // TODO:
    // returnType FC<Props & T> should be `Props & ComponentProps<typeof ComponentIn>`
    // but it return error of `Type 'ComponentProps' is not generic.ts(2315)`
    const ComponetOut: FC<Props & T> = ({display, editing, transformValue, onEditChange, wrapClassName, ...props}) => {
        const {value, onChange, disabled} = props;
        const [editValue, setEditValue] = useState(value);
        const containerRef = useRef(null);
        const [shouldRenderEditComponent, switchShouldRenderEditComponent] = useDerivedState(editing);

        const {defaultEditComponentProps} = options;

        const switchEditStatus = useCallback(
            (newStatus: boolean, fireAfterSwitch: {fireOnChange?: any, fireStateChange?: any} = {}): void => {
                if (disabled) {
                    return;
                }

                if (shouldRenderEditComponent === newStatus) {
                    return;
                }

                if (onEditChange) {
                    onEditChange(newStatus);
                }
                switchShouldRenderEditComponent(newStatus);

                const {fireOnChange, fireStateChange} = fireAfterSwitch;
                if (fireOnChange) {
                    onChange(fireOnChange);
                }

                if (fireStateChange) {
                    setEditValue(fireStateChange);
                }
            },
            [shouldRenderEditComponent, switchShouldRenderEditComponent, disabled, onEditChange, onChange]
        );

        const displayComponent = useMemo(
            () => {
                if (shouldRenderEditComponent) {
                    return null;
                }

                if (typeof display === 'function') {
                    return display(value);
                } else {
                    return value;
                }
            },
            [shouldRenderEditComponent, display, value]
        );

        const handleChange = useCallback(
            (...args) => {
                const transformedValue = transformValue ? transformValue(...args) : args[0];
                setEditValue(transformedValue);
            },
            [onChange]
        );

        const handleKeyDown = useCallback(
            event => {
                const {keyCode} = event;

                if (isEnter(keyCode)) {
                    if (shouldRenderEditComponent) {
                        switchEditStatus(false, {
                            fireOnChange: editValue,
                        });
                    } else {
                        switchEditStatus(true);
                    }
                } else if (isEsc(keyCode)) {
                    switchEditStatus(false, {
                        fireStateChange: value,
                    });
                }
            },
            [switchEditStatus, editValue, value]
        );

        const handleClick = useCallback(
            () => {
                if (!shouldRenderEditComponent) {
                    switchEditStatus(true);
                }
            },
            [switchEditStatus, shouldRenderEditComponent]
        );

        useClickOutside(containerRef, () => {
            setTimeout(
                () => {
                    if (shouldRenderEditComponent) {
                        onChange(editValue);
                        switchEditStatus(false);
                    }
                },
                0
            );
        });

        const classNames = c(
            'quick-edit', 
            {
                'quick-edit-disabled': !!disabled,
                'quick-edit-editing': shouldRenderEditComponent
            },
            wrapClassName
        );

        return (
            <div ref={containerRef} className={classNames} tabIndex={0} onKeyDown={handleKeyDown} onClick={handleClick}>
                {shouldRenderEditComponent ? (
                    <ComponentIn
                        key={String(shouldRenderEditComponent)}
                        {...props}
                        {...defaultEditComponentProps}
                        onChange={handleChange}
                        value={editValue}
                    />
                ) : (
                    displayComponent
                )}
            </div>
        );
    };

    if (typeof ComponentIn === 'string') {
        ComponetOut.displayName = ComponentIn;
        return ComponetOut as typeof ComponetOut & S;
    }

    const originalDislayName =ComponentIn.displayName || ComponentIn.name;
    ComponetOut.displayName = originalDislayName;

    return Object.assign(ComponetOut, ComponentIn as unknown as S);
};

const registerAll = (mapping: {[key: string]: Parameters<typeof register>}) => {
    return mapValues(mapping, register)
};

export default {
    register,
    registerAll,
};
