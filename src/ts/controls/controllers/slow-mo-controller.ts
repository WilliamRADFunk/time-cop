export class SlowMoCtrl {
    private _difficulty: number = 3;

    private _isSlowMo: boolean = false;

    private _slowMoCounter: number = 0;

    constructor() {}

    private _setCounter(): void {
        this._slowMoCounter = (5 - this._difficulty) * 60;
    }

    public endCycle(): void {
        if (this._slowMoCounter) {
            this._slowMoCounter--;

            // TODO: Display time countdown until normal speed.

            if (this._slowMoCounter <= 0) {
                this.exitSlowMo();
                this._slowMoCounter = 0;
            }
        }
    }

    public enterSlowMo(isBonusTime?: boolean): void {
        this._isSlowMo = true;
        if (isBonusTime) {
            this._setCounter();
        }
    }

    public exitSlowMo(): void {
        this._isSlowMo = false;
    }

    public getSlowMo(): boolean {
        return this._isSlowMo;
    }

    public setDifficulty(difficulty: number): void {
        this._difficulty = difficulty;
    }
}

export const SlowMo_Ctrl = new SlowMoCtrl();