
export enum DiceState {
    Normal,
    Click,
    Mask,
}
export class GlobaData {

    public static currScore: number = 0;//本轮分数
    public static currRollScore: number = 0;//本次分数
    public static AllScore: number = 0;//总分
    public static diceData: number[] = [];
    public static currTutn: number = 0; //本局轮数;
    public static rollTime: number = 0; //本轮摇骰子次数
    public static alreadyLose: number = 0;//已经输轮数

    public static dicePos = [cc.v2(-300, -120), cc.v2(-170, -210), cc.v2(-20, -100), cc.v2(5, -280), cc.v2(160, -160), cc.v2(320, -120)]

    public static clearData() {
        this.currScore = 0;
        this.AllScore = 0;
        this.diceData = [];
        this.currTutn = 1;
        this.rollTime = 0;
        this.currRollScore = 0;
    }

    static getRandomIntInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomIntsInRange(min: number, max: number, count: number): number[] {
        let result: number[] = [];
        for (let i = 0; i < count; i++) {
            let randomInt = this.getRandomIntInRange(min, max);
            result.push(randomInt);
        }
        return result;
    }

    static getDiceScore(data: number[]): number {

        if (data.length <= 0)
            return 0;

        let pointCount: number[] = [];
        for (let i = 0; i < data.length; i++) {
            let point = data[i];
            if (pointCount[point]) {
                pointCount[point]++;
            } else {
                pointCount[point] = 1;
            }
        }

        let score = 0;
        let isTriple = false;
        let isSequential = true;
        let doubleCount = 0;

        for (let point = 0; point < pointCount.length; point++) {

            if (pointCount[point] == 1) {
                if (point == 0) {
                    score += 100;
                }
                if (point == 4) {
                    score += 50;
                }
            }
            if (pointCount[point] >= 3) {
                isTriple = true;
                if (point != 0) {
                    score += (point + 1) * 100 * (pointCount[point] - 2);
                } else {
                    score += 1000 * (pointCount[point] - 2);
                }
            }

            if (pointCount[point] == 2) {
                doubleCount++;
                if (point == 0) {
                    score += 200;
                }
                if (point == 4) {
                    score += 100;
                }
            }

            if (data.length < 6 || pointCount[point] == 0 || pointCount[point] > 1) {
                isSequential = false;
            }
        }

        if (doubleCount > 2) {
            cc.log("全对子")
            score = 750;
        }
        if (isSequential) {
            cc.log("顺子")
            score = 1500;
        }

        return score;
    }

    static isCombination(data: number[]): boolean {

        let combination = true;
        if (data.length <= 0)
            return combination;

        let pointCount: number[] = [];
        for (let i = 0; i < data.length; i++) {
            let point = data[i];
            if (pointCount[point]) {
                pointCount[point]++;
            } else {
                pointCount[point] = 1;
            }
        }

        let isTriple = false;
        let isSequential = true;
        let doubleCount = 0;
        let count = 0;

        for (let point = 0; point < pointCount.length; point++) {

            if (pointCount[point] == 1) {
                if (point == 0) {
                    count++;
                }
                if (point == 4) {
                    count++;
                }
            }
            if (pointCount[point] >= 3) {
                isTriple = true;
                count += pointCount[point];
            }

            if (pointCount[point] == 2) {
                doubleCount++;
                if (point == 0) {
                    count += 2;
                }
                if (point == 4) {
                    count += 2;
                }
            }

            if (data.length < 6 || pointCount[point] == 0 || pointCount[point] > 1) {
                isSequential = false;
            }
        }

        if (doubleCount > 2 || isSequential) {
            return combination
        }
        if (count != data.length) {
            combination = false;
        }

        return combination;
    }
}


