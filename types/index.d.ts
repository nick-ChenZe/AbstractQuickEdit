type LessClassName = string | undefined;
type LessClassNameObject = {[key: string]: boolean};
type LessClassNameFunction = (...args: (LessClassName | LessClassNameObject)[]) => LessClassName;

declare module '*.less' {
    const resource: LessClassNameFunction;
    export default resource;
}
