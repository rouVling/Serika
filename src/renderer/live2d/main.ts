/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate } from './lappdelegate';
import * as LAppDefine from './lappdefine';
import { LAppGlManager } from './lappglmanager';
import { LAppLive2DManager } from './lapplive2dmanager';

/**
 * ブラウザロード後の処理
 * 当浏览器加载后的处理
 */

window.addEventListener(
  'load',
  (): void => {
    // Initialize WebGL and create the application instance
    if (
      !LAppGlManager.getInstance() ||
      !LAppDelegate.getInstance().initialize()
    ) {
      return;
    }

    LAppDelegate.getInstance().run();

    // adding ignore mouse event listener
    let parent = document.getElementById('live2d');
    parent?.addEventListener("pointermove", (e) => {
      // console.log("pointermove: ", e.x, e.y)
      // console.log()
      const model = LAppLive2DManager.getInstance().getModel(0);
      const view = LAppDelegate.getInstance().getView();
      const x = view?._deviceToScreen.transformX(e.x);
      const y = view?._deviceToScreen.transformY(e.y);
      // console.log(model?.anyhitTest(x, y))
      window.api.setIgnoreMouseEvent(!model?.anyhitTest(x, y))
      // const canvas = parent?.children[0] as HTMLCanvasElement;
      // const ctx = canvas.getContext('webgl');
      // let arr = new Uint8Array(4);
      // ctx?.readPixels(e.x, e.y, 1, 1, ctx.ALPHA, ctx.UNSIGNED_BYTE, arr);
      // console.log(arr)
      // window.api.setIgnoreMouseEvent(alpha![3] === 0)

    });
  },
  { passive: true }
);

/**
 * 終了時の処理
 * 结束时的处理
 */
window.addEventListener(
  'beforeunload',
  (): void => LAppDelegate.releaseInstance(),
  { passive: true }
);

/**
 * Process when changing screen size.
 */
window.addEventListener(
  'resize',
  () => {
    if (LAppDefine.CanvasSize === 'auto') {
      LAppDelegate.getInstance().onResize();
    }
  },
  { passive: true }
);
