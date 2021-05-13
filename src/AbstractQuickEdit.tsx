import React, {
    ComponentProps,
    ElementType,
    ComponentType,
    ReactNode,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import c from 'classnames';
import {useDerivedState} from '@huse/derived-state';
import {useClickOutside} from '@huse/click-outside';
import mapValues from 'lodash.mapvalues';
import {isEsc, isEnter, nameCapitalized} from './utils';

interface Options {
    defaultEditComponentProps?: {[key: string]: any};
}

interface Props<Value, EventValue> {
    // Value of edit component
    value: Value;
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
    // In the mean time the value prop of `DatePicker` is string format like `YYYY-MM-DD`
    // this prop will be useful in this case.
    transformValue?: (value: EventValue) => any;
    // Not like the normal `onChange`, this callback will be invoked only by edit status switch `true` to `false`.
    onChange: (...args: any[]) => void;
    // Invoke when edit status changed.
    onEditChange?: (status: boolean, value: Value) => void;
}

// Obtain the return type of a function type
type UtilPickOnChangeValue<C extends ElementType> = Parameters<ComponentProps<C>['onChange']>[0];
type UtilPickValue<C extends ElementType> = ComponentProps<C>['value'];
type UtilOmitControlProp<C extends ElementType> = Omit<ComponentProps<C>, 'value' | 'onChange'>;

const identity = (s: any) => s;

type RegisteredCustomizedComponentProps<C extends ElementType> = UtilOmitControlProp<C> &
    Props<UtilPickValue<C>, UtilPickOnChangeValue<C>>;

// `register` is a HOC, which make a edit component be capable of switching between display type and edit type.
const register = <P extends {onChange?: (...args: any[]) => any, value?: unknown}>(
    ComponentIn: ComponentType<P> | 'input' | 'select',
    options: Options = {}
) => {
    const ComponetOut: React.FC<RegisteredCustomizedComponentProps<ComponentType<P> | 'input' | 'select'>> = ({
        display = identity,
        editing,
        transformValue,
        onEditChange,
        wrapClassName,
        value,
        onChange,
        disabled,
        ...props
    }) => {
        const [editValue, setEditValue] = useDerivedState(value);
        const containerRef = useRef(null);
        const [shouldRenderEditComponent, switchShouldRenderEditComponent] = useDerivedState(editing);

        const {defaultEditComponentProps} = options;

        const handleOnChangeWhenValueChanged = useCallback(
            newValue => {
                if (value !== newValue) {
                    onChange(newValue);
                }
            },
            [onChange, value]
        );

        const switchEditStatus = useCallback(
            (newStatus: boolean, fireAfterSwitch: {fireOnChange?: any, fireStateChange?: any} = {}): void => {
                if (disabled) {
                    return;
                }

                if (onEditChange) {
                    // @ts-ignore TODO: fix editValue type
                    onEditChange(newStatus, editValue);
                }
                switchShouldRenderEditComponent(newStatus);

                const {fireOnChange, fireStateChange} = fireAfterSwitch;
                if (fireOnChange) {
                    handleOnChangeWhenValueChanged(fireOnChange);
                }

                if (fireStateChange) {
                    setEditValue(fireStateChange);
                }
            },
            [
                switchShouldRenderEditComponent,
                disabled,
                onEditChange,
                setEditValue,
                editValue,
                handleOnChangeWhenValueChanged,
            ]
        );

        const displayComponent = useMemo(
            () => {
                if (shouldRenderEditComponent) {
                    return null;
                }

                return display(value);
            },
            [shouldRenderEditComponent, display, value]
        );

        const handleChange = useCallback(
            (value: UtilPickOnChangeValue<typeof ComponentIn>) => {
                const transformedValue = transformValue ? transformValue(value) : value;
                setEditValue(transformedValue);
            },
            [setEditValue, transformValue]
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
                } else if (isEsc(keyCode) && shouldRenderEditComponent) {
                    switchEditStatus(false, {
                        fireStateChange: value,
                    });
                }
            },
            [shouldRenderEditComponent, switchEditStatus, editValue, value]
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
                        handleOnChangeWhenValueChanged(editValue);
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
                'quick-edit-editing': shouldRenderEditComponent,
            },
            wrapClassName
        );

        return (
            <div ref={containerRef} className={classNames} tabIndex={0} onKeyDown={handleKeyDown} onClick={handleClick}>
                {(editing ?? shouldRenderEditComponent) ? (
                    <ComponentIn
                        {...props}
                        {...defaultEditComponentProps}
                        disabled={disabled}
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
        ComponetOut.displayName = nameCapitalized(ComponentIn);
        return ComponetOut;
    }

    const originalDislayName = ComponentIn.displayName || ComponentIn.name;
    ComponetOut.displayName = originalDislayName;

    return ComponetOut;
};

const registerAll = (mapping: {[key: string]: Parameters<typeof register>}) => {
    return mapValues(mapping, register);
};

export default {
    register,
    registerAll,
};
