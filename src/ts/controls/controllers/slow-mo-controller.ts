export class SlowMoCtrl {
    private _isSlowMo: boolean = false;

    constructor() {}

    public enterSlowMo(): void {
        this._isSlowMo = true;
    }

    public exitSlowMo(): void {
        this._isSlowMo = false;
    }

    public getSlowMo(): boolean {
        return this._isSlowMo;
    }
}

export const SlowMo_Ctrl = new SlowMoCtrl();