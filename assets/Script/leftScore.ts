import { GlobaData } from "./GlobaData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class leftScore extends cc.Component {

    @property(cc.Label)
    scorelabel: cc.Label = null;

    @property(cc.SpriteFrame)
    bgSp: cc.SpriteFrame[] = [];

    @property
    myTurnTime: number = 0;

    initData() {
        this.updateBg();
        this.scorelabel.string = "0";
        this.scorelabel.node.color = cc.color(255, 255, 255);
    }

    updateBg() {

        if (GlobaData.currTutn == this.myTurnTime) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.bgSp[0];
        } else {
            this.node.getComponent(cc.Sprite).spriteFrame = this.bgSp[1];
        }
    }

    updateScore(score) {
        if (GlobaData.currTutn == this.myTurnTime) {
            this.scorelabel.string = score + "";
            this.scorelabel.node.color = cc.color(255, 255, 255);
        }
    }

    setFarkle() {
        if (GlobaData.currTutn == this.myTurnTime) {
            this.scorelabel.string = "FARKLE!";
            this.scorelabel.node.color = cc.color(238, 116, 77);
        }
    }

}
