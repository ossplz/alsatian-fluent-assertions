export class FluentNode {
    public child: FluentNode;
    public get name(): string { return this._name; }
    public get details(): string { return this._details; }
    public get fullname(): string { return this.details ? this.name + `[${this.details}]` : this.name }
    constructor(
        private _name: string,
        private _details?: string,
        public parent?: FluentNode) {
        if (parent) {
            parent.child = this;
        }
    }

}