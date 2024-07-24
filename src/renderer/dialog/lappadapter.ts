import { LAppLive2DManager } from "../live2d/lapplive2dmanager";
import { LAppModel } from "../live2d/lappmodel";

import {
  ACubismMotion,
  FinishedMotionCallback
} from '@framework/motion/acubismmotion';
import {
  CubismMotionQueueEntryHandle,
  InvalidMotionQueueEntryHandleValue
} from '@framework/motion/cubismmotionqueuemanager';

export let s_adapter_instance : LAppAdapter | null | undefined = null;

export class LAppAdapter {
  public static getInstance(): LAppAdapter {
    if (s_adapter_instance == null) {
      s_adapter_instance = new LAppAdapter();
    }

    return s_adapter_instance;
  }

  /* gets */

  private getMgr(): LAppLive2DManager {
    return LAppLive2DManager.getInstance();
  }

  public getModel(): LAppModel | null {
    return this.getMgr().getModel(0);
  }

  /* motion */

  public getMotionGroups(): string[] {
    let groups : string[] = [];
    for (let i = 0; i < this.getModel()?._modelSetting.getMotionGroupCount(); i++) {
      groups.push(this.getModel()?._modelSetting.getMotionGroupName(i) ?? "");
    }
    return groups;
  }

  public getMotionCount(group: string): number {
    return this.getModel()?._modelSetting.getMotionCount(group) ?? 0;
  }

  public startMotion(
    group: string,
    no: number,
    priority: number,
    onFinishedMotionHandler?: FinishedMotionCallback
  ): CubismMotionQueueEntryHandle {
    return this.getModel()?.startMotion(group, no, priority, onFinishedMotionHandler) ?? InvalidMotionQueueEntryHandleValue;
  }

  /* expression */

  public getExpressionCount(): number {
    return this.getModel()?._expressions.getSize() ?? 0;
  }

  public getExpressionName(index: number): string {
    return this.getModel()?._expressions._keyValues[index].first;
  }

  public setExpression(name: string): void {
    this.getModel()?.setExpression(name);
  }

  public nextScene(): void {
    this.getMgr().nextScene();
  }

  // private _live2DMgr: LAppLive2DManager;
}