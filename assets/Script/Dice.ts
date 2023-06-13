import { DiceState } from "./GlobaData";
import gameMain from "./gameMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dice extends cc.Component {

    @property(cc.SpriteFrame)
    diceSp: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    dice_mask: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    diceSp_click: cc.SpriteFrame[] = [];

    public diceState: DiceState = DiceState.Normal;

    public myDiceNumber: number = 0;

    private mainSp: gameMain = null;

    setMainSp(mainSp: gameMain) {
        this.mainSp = mainSp;
    }

    setSpeite(diceNumber: number, isMask: boolean = false, isClick: boolean = false) {

        // if (this.diceState == DiceState.Mask) {
        //     return;
        // }

        if (diceNumber == 0 || diceNumber == 4) {
            isClick = true;
        }

        this.myDiceNumber = diceNumber;

        if (isMask) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.dice_mask[diceNumber];
            this.diceState = DiceState.Mask;
            return;
        }

        if (isClick) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.diceSp_click[diceNumber];
            this.diceState = DiceState.Click;
            return;
        }


        this.node.getComponent(cc.Sprite).spriteFrame = this.diceSp[diceNumber];
        this.diceState = DiceState.Normal;
    }

    onClickDice() {
        cc.log(this.myDiceNumber, this.diceState);
        if (this.diceState != DiceState.Click) {
            return;
        }
        this.mainSp.chooseDice(this.myDiceNumber);
        this.setSpeite(this.myDiceNumber, true);
    }
}
