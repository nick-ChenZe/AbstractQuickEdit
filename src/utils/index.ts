const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;

export const isEnter = (keyCode: number): boolean => {
    return keyCode ===  ENTER_KEYCODE;
};

export const isEsc = (keyCode: number): boolean => {
    return keyCode === ESC_KEYCODE;
};

export const nameCapitalized = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);
