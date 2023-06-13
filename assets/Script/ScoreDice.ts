import { GlobaData } from "./GlobaData";
import gameMain from "./gameMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreDice extends cc.Component {

    @property(cc.SpriteFrame)
    diceSp: cc.SpriteFrame[] = [];

    public myDiceNumber: number = 0;

    public myRollTime: number = 0;

    private mainSp: gameMain = null;

    setSpeite(diceNumber: number, mainSp: gameMain) {

        this.myDiceNumber = diceNumber;
        this.mainSp = mainSp;
        this.node.getComponent(cc.Sprite).spriteFrame = this.diceSp[diceNumber];
        this.myRollTime = GlobaData.rollTime;
    }

    onClickDice() {
        cc.log(this.myDiceNumber, this.myRollTime);
        if (this.myRollTime != GlobaData.rollTime) {
            return;
        }
        this.node.removeFromParent();
        this.mainSp.canleDice(this.myDiceNumber);
    }
}
