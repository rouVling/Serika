/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

export let canvas: HTMLCanvasElement | null = null;
export let gl: WebGLRenderingContext | null = null;
export let s_instance: LAppGlManager | null = null;

let mygl: WebGLRenderingContext | null = null;

/**
 * Cubism SDKのサンプルで使用するWebGLを管理するクラス
 */
export class LAppGlManager {
  /**
   * クラスのインスタンス（シングルトン）を返す。
   * インスタンスが生成されていない場合は内部でインスタンスを生成する。
   *
   * @return クラスのインスタンス
   */
  public static getInstance(): LAppGlManager {
    if (s_instance == null) {
      s_instance = new LAppGlManager();
    }

    return s_instance;
  }

  /**
   * クラスのインスタンス（シングルトン）を解放する。
   */
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance.release();
    }

    s_instance = null;
  }

  constructor() {
    // キャンバスの作成
    canvas = document.createElement('canvas');
    canvas.style.backgroundColor = 'transparent';

    // glコンテキストを初期化
    // @ts-ignore
    // mygl = canvas.getContext('webgl2', {alpha: false});
    // mygl = canvas.getContext('webgl2', {alpha: true});
    gl = canvas.getContext('webgl2', {alpha: true});
    // mygl?.clearColor(0, 0, 0, 0);
    // mygl?.clear(mygl.COLOR_BUFFER_BIT);
    // mygl?.enable(mygl.BLEND);

    // gl = null;

    if (!gl) {
      // gl初期化失敗
      // alert('Cannot initialize WebGL. This browser does not support.');
      gl = null;

      document.body.innerHTML =
        'This browser does not support the <code>&lt;canvas&gt;</code> element.';
    }
  }

  /**
   * 解放する。
   */
  public release(): void {}
}
