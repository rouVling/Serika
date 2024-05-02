/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

/**
 * プラットフォーム依存機能を抽象化する Cubism Platform Abstraction Layer.
 * 抽象化Cubism平台依赖功能。
 *
 * ファイル読み込みや時刻取得等のプラットフォームに依存する関数をまとめる。
 * 将依赖于平台的功能（如文件读取和时间获取）集中在一起。
 */
export class LAppPal {
  /**
   * ファイルをバイトデータとして読みこむ 读取文件为字节数据
   *
   * @param filePath 読み込み対象ファイルのパス [Path to the file to be read]
   * @return
   * {
   *      buffer,   読み込んだバイトデータ [Read byte data]
   *      size        ファイルサイズ [File size]
   * }
   */
  public static loadFileAsBytes(
    filePath: string,
    callback: (arrayBuffer: ArrayBuffer, size: number) => void
  ): void {
    fetch(filePath)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => callback(arrayBuffer, arrayBuffer.byteLength));
  }

  /**
   * デルタ時間（前回フレームとの差分）を取得する
   * @return デルタ時間[ms]
   * 
   * 获取增量时间（与上一帧的差异）
   */
  public static getDeltaTime(): number {
    return this.s_deltaTime;
  }

  public static updateTime(modifyLastFrameTime: boolean = true): void {
    this.s_currentFrame = Date.now();
    this.s_deltaTime = (this.s_currentFrame - this.s_lastFrame) / 1000;
    // this.s_lastFrame = this.s_currentFrame;
    if (modifyLastFrameTime === true) {
      this.s_lastFrame = this.s_currentFrame;
    }
  }

  /**
   * メッセージを出力する
   * @param message 文字列
   * 
   * 输出消息
   */
  public static printMessage(message: string): void {
    console.log(message);
  }

  static lastUpdate = Date.now();

  static s_currentFrame = 0.0;
  static s_lastFrame = 0.0;
  static s_deltaTime = 0.0;
}
