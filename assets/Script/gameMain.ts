import { DiceState, GlobaData } from "./GlobaData";
import Dice from "./Dice";
import ScoreDice from "./ScoreDice";
import leftScore from "./leftScore";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameMain extends cc.Component {

    @property(cc.Node)
    diceCup: cc.Node = null;

    @property(cc.Node)
    diceParent: cc.Node = null;

    @property(cc.Node)
    selectTip: cc.Node = null;

    @property(cc.Node)
    errorTip: cc.Node = null;

    @property(cc.Node)
    gameTip: cc.Node = null;

    @property(cc.Node)
    selectNode: cc.Node = null;

    @property(cc.Node)
    leftScore: cc.Node = null;

    @property(cc.ScrollView)
    leftScrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    dicePerfab: cc.Prefab = null;

    @property(cc.Button)
    collectBtn: cc.Button = null;

    @property(cc.Prefab)
    scoreDicePerfab: cc.Prefab = null;

    @property(cc.Label)
    AllScore: cc.Label = null;

    @property(cc.Node)
    startNode: cc.Node = null;

    @property(cc.Node)
    overNode: cc.Node = null;

    @property(cc.Label)
    endScore: cc.Label = null;

    @property(cc.Node)
    success: cc.Node[] = [];

    @property(cc.Node)
    endTitle: cc.Node[] = [];

    public currDiceSp: Dice[] = [];

    public currCanClickDices = [];

    public currClickedCount: number = 0;

    public currClickedDices: number[] = [];//本轮次已选中的骰子

    public currRollClickedDices: number[] = [];//当前已选中的骰子

    private isFarkle: boolean = false;

    protected start(): void {
        this.initData();
        this.startNode.active = true;
    }

    initData() {
        GlobaData.clearData();
        this.selectTip.opacity = 0;
        this.errorTip.opacity = 0;
        this.collectBtn.interactable = false;
        this.AllScore.string = GlobaData.AllScore + "";
        this.gameTip.children[0].active = false;
        this.gameTip.children[1].active = false;
        this.currDiceSp = [];
        this.currCanClickDices = [];
        this.isFarkle = false;
        this.diceParent.removeAllChildren();
        this.cleanSelect();

        this.leftScore.children.forEach(child => {
            let tmp = child.getComponent(leftScore);
            tmp.initData();
        })
    }

    gameOver() {
        let win = GlobaData.AllScore >= 5000;
        this.overNode.active = true;
        this.endScore.string = GlobaData.AllScore + "";
        if (win) {
            this.success[0].active = true;
            this.success[1].active = false;
            this.endTitle[0].active = true;
            this.endTitle[1].active = false;
        } else {
            this.success[1].active = true;
            this.success[0].active = false;
            this.endTitle[1].active = true;
            this.endTitle[0].active = false;
        }
    }

    tryAgain() {
        this.overNode.active = false;
        this.initData();
    }

    home() {
        this.overNode.active = false;
        this.initData();
        this.startNode.active = true;
    }

    startGame() {
        this.startNode.active = false;
    }

    onCollect() {
        if (!this.collectBtn.interactable) return;
        this.cleanSelect();
        this.diceParent.removeAllChildren();
        this.updataScore();
        GlobaData.currScore += GlobaData.currRollScore;
        GlobaData.AllScore += GlobaData.currScore;
        GlobaData.currTutn++;
        GlobaData.rollTime = 0;
        GlobaData.currScore = 0;
        GlobaData.currRollScore = 0;
        GlobaData.alreadyLose = 0;
        this.collectBtn.interactable = false;

        if (GlobaData.currTutn > 10) {
            this.gameOver();
            return;
        }
    }

    updataScore() {
        let temp = this.getCurrLeftScoreSp();
        temp.updateBg();
        if (GlobaData.currTutn > 7) {
            this.leftScrollView.scrollToBottom(0.1)
        } else {
            this.leftScrollView.scrollToTop(0.1);
        }
        if (this.isFarkle && GlobaData.alreadyLose < 3 && GlobaData.currScore >= 0) {
            temp.setFarkle();
        } else {
            temp.updateScore(GlobaData.currScore + GlobaData.currRollScore);
        }
        this.AllScore.string = (GlobaData.AllScore + GlobaData.currScore + GlobaData.currRollScore) + "";
    }

    getCurrLeftScoreSp(): leftScore {
        for (let index = 0; index < this.leftScore.children.length; index++) {
            let tmp = this.leftScore.children[index].getComponent(leftScore);
            tmp.updateBg();
            if (tmp.myTurnTime == GlobaData.currTutn) {
                return tmp;
            }
        }
    }

    cleanSelect() {
        this.selectNode.children.forEach(element => {
            element.removeAllChildren();
        });
        this.currClickedDices = [];
        this.currClickedCount = 0;
        this.currRollClickedDices = [];
    }

    updateDiceClick(special: boolean, num?: number): void {
        this.currCanClickDices = [];
        for (let i = 0; i < this.currDiceSp.length; i++) {
            if (special) {
                this.currDiceSp[i].setSpeite(this.currDiceSp[i].myDiceNumber, false, true);
            } else {
                if (this.currDiceSp[i].myDiceNumber == num) {
                    this.currDiceSp[i].setSpeite(num, false, true);
                }
            }
            if (this.currDiceSp[i].diceState == DiceState.Click) {
                this.currCanClickDices.push(this.currDiceSp[i]);
            }
        }
    }

    showSelectTip() {
        this.selectTip.stopAllActions();
        cc.tween(this.selectTip)
            .to(0.01, { opacity: 255 })
            .delay(1)
            .to(0.2, { opacity: 0 })
            .start();
    }

    showErrorTip() {
        this.errorTip.stopAllActions();
        cc.tween(this.errorTip)
            .to(0.01, { opacity: 255 })
            .delay(1)
            .to(0.2, { opacity: 0 })
            .start();
    }

    onRoll() {

        if (GlobaData.currTutn > 10) {
            //game over
            this.gameOver();
            return;
        }
        if (this.isFarkle && GlobaData.currTutn == 10) {
            this.gameOver();
            return;
        }

        let combination = GlobaData.isCombination(this.currRollClickedDices);
        if (this.currClickedCount > 0 && !combination) {
            this.showErrorTip()
            return;
        }

        if (GlobaData.rollTime > 0 && this.currClickedCount == 0 && !this.isFarkle) {
            this.showSelectTip();
            return;
        }

        if (this.isFarkle) {
            GlobaData.alreadyLose++;
            this.gameTip.children[1].active = false;
            if (GlobaData.alreadyLose >= 3) {
                GlobaData.currScore = -500;
                GlobaData.AllScore += GlobaData.currScore;
                GlobaData.alreadyLose = 0;
            } else {
                GlobaData.currScore = 0;
                GlobaData.AllScore += GlobaData.currScore;
            }
            this.updataScore();
            GlobaData.currTutn++;
            GlobaData.rollTime = 0;
            GlobaData.currScore = 0;
            GlobaData.currRollScore = 0;
            this.cleanSelect();
        }

        if (GlobaData.rollTime >= 6) {
            GlobaData.currScore += GlobaData.currRollScore;
            GlobaData.AllScore += GlobaData.currScore;
            GlobaData.currTutn++;
            GlobaData.rollTime = 0;
            GlobaData.currScore = 0;
            GlobaData.currRollScore = 0;
            GlobaData.alreadyLose = 0;
            this.updataScore();
            this.cleanSelect();
        }

        this.isFarkle = false;
        this.updataScore();
        this.currClickedDices = this.currClickedDices.concat(this.currRollClickedDices);
        this.currRollClickedDices = [];
        GlobaData.currScore += GlobaData.currRollScore;
        GlobaData.currRollScore = 0;

        this.diceParent.removeAllChildren();
        this.gameTip.children[1].active = false;
        this.currDiceSp = [];
        let diceNum = 6 - this.currClickedDices.length;
        GlobaData.diceData = GlobaData.getRandomIntsInRange(0, 5, diceNum);

        GlobaData.rollTime++;
        this.currClickedCount = 0;

        for (let i = 0; i < GlobaData.diceData.length; i++) {
            let dice = cc.instantiate(this.dicePerfab);
            this.currDiceSp[i] = dice.getComponent(Dice);
            this.currDiceSp[i].setSpeite(GlobaData.diceData[i]);
            this.currDiceSp[i].setMainSp(this);
            dice.position = cc.v2(500, -300);
            dice.setParent(this.diceParent);
        }

        let cupAni = this.diceCup.getComponent(cc.Animation);
        cupAni.play();
        cupAni.on("finished", () => {
            for (let i = 0; i < GlobaData.diceData.length; i++) {
                cc.tween(this.currDiceSp[i].node)
                    .to(0.5, { position: GlobaData.dicePos[i] })
                    .start();
            }
            this.getDiceState();
            let score = GlobaData.getDiceScore(GlobaData.diceData);
            if (score == 0) {
                this.gameTip.children[1].active = true;
                this.isFarkle = true;
                this.collectBtn.interactable = false;
            }
        }, this);
    }

    getDiceState() {

        let pointCount: number[] = [];
        for (let i = 0; i < GlobaData.diceData.length; i++) {
            let point = GlobaData.diceData[i];
            if (pointCount[point]) {
                pointCount[point]++;
            } else {
                pointCount[point] = 1;
            }
        }

        let isSequential = true;
        let doubleCount = 0;

        for (let point = 0; point < pointCount.length; point++) {

            if (pointCount[point] >= 3) {
                cc.log(pointCount[point], "个", point);
                this.updateDiceClick(false, point);
            }

            if (pointCount[point] == 2) {
                doubleCount++;
            }

            if (GlobaData.diceData.length < 6 || pointCount[point] == 0 || pointCount[point] > 1) {
                isSequential = false;
            }
        }

        if (doubleCount > 2) {
            cc.log("全对子")
            this.updateDiceClick(true);
        }
        if (isSequential) {
            cc.log("顺子")
            this.updateDiceClick(true);
        }
    }

    chooseDice(dice: number) {
        this.currClickedCount++;
        this.currRollClickedDices.push(dice);
        let tempD = cc.instantiate(this.scoreDicePerfab);
        tempD.getComponent(ScoreDice).setSpeite(dice, this);
        tempD.setParent(this.selectNode.children[GlobaData.rollTime - 1]);

        let score = GlobaData.getDiceScore(this.currRollClickedDices);
        GlobaData.currRollScore = score;
        if ((this.currClickedDices.length + this.currRollClickedDices.length) == 6) {
            //free roll!
            this.diceParent.removeAllChildren();
            this.gameTip.children[0].active = true;
            this.gameTip.children[0].opacity = 255;
            this.gameTip.children[0].runAction(cc.fadeOut(2));
            this.cleanSelect();
            this.diceParent.removeAllChildren();
            GlobaData.rollTime = 0;
        }
        cc.log("目前分数", GlobaData.currScore + GlobaData.currRollScore)
        if ((GlobaData.currScore + GlobaData.currRollScore) >= 300) {
            this.collectBtn.interactable = true;
        } else {
            this.collectBtn.interactable = false;
        }
        this.updataScore();
    }

    canleDice(dice: number) {
        this.currClickedCount--;
        let index = this.currRollClickedDices.indexOf(dice);
        if (index !== -1) {
            this.currRollClickedDices.splice(index, 1);
        }

        for (let i = 0; i < this.currDiceSp.length; i++) {
            if (this.currDiceSp[i].myDiceNumber == dice && this.currDiceSp[i].diceState == DiceState.Mask) {
                this.currDiceSp[i].setSpeite(dice, false, true);
                break;
            }
        }
        let score = GlobaData.getDiceScore(this.currRollClickedDices);
        GlobaData.currRollScore = score;
        cc.log("目前分数", GlobaData.currScore + GlobaData.currRollScore)
        if ((GlobaData.currScore + GlobaData.currRollScore) >= 300) {
            this.collectBtn.interactable = true;
        } else {
            this.collectBtn.interactable = false;
        }
        this.updataScore();
    }
}
