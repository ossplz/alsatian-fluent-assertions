import { IFluentNode } from "./i-fluent-node";

export class RootNode implements IFluentNode {
    public parent: IFluentNode;
    public constructor(
        public name: string,
        public details: string
    ){}
    public get fullname(): string { return this.details ? this.name + `[${this.details}]` : this.name }
}