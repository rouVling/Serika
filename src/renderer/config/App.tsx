import React, { useEffect, useState } from "react"
import { BoolItem, TextFieldItem, TextItemPart, LongTextFieldItem } from "./components";
import Store from 'electron-store'

import KeyIcon from '@mui/icons-material/Key';
import InfoIcon from '@mui/icons-material/Info';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SecurityIcon from '@mui/icons-material/Security';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SettingsIcon from '@mui/icons-material/Settings';
import WalletIcon from '@mui/icons-material/Wallet';
import AdsClickIcon from '@mui/icons-material/AdsClick';

export default function App() {

  // const store = new Store()

  // const [apiKey, setApiKey] = useState(store.get("apiKey") || "")

  const [activeChat, setActiveChat] = useState(false)
  const [apikey, setApikey] = useState("")
  const [enableClickThrough, setEnableClickThrough] = useState(false)
  const [tokenSaveMode, setTokenSaveMode] = useState(true)
  const [prompt, setPrompt] = useState("")

  const [tabNum, setTabNum] = useState(0)
  const [on, setOn] = useState(false)

  useEffect(() => {
    window.api.getStore("apikey").then((value: string) => {
      setApikey(value? value : "")
    })
  }, [])

  useEffect(() => {
    window.api.getStore("tokenSaveMode").then((value: boolean) => {
      setTokenSaveMode(value === undefined? true: value)
    })
  }, [])

  useEffect(() => {
    window.api.getStore("enableClickThrough").then((value: boolean) => {
      setEnableClickThrough(value === undefined? false: value)
    })
  }, [])

  useEffect(() => {
    window.api.getStore("prompt").then((value: string) => {
      setPrompt(value? value : "")
    })
  }, [])

  return <div id="totalContainer">
    <div id="leftContainer">

      <div className={"leftContainerItem" + ((tabNum == 0) ? " highlight" : "")} onClick={() => setTabNum(0)}>
        <div className="highlightBar" />
        <SettingsIcon />
        <div>common</div>
      </div>

      <div className={"leftContainerItem" + ((tabNum == 1) ? " highlight" : "")} onClick={() => setTabNum(1)}>
        <div className="highlightBar" />
        <SecurityIcon />
        <div>privacy</div>
      </div>

      <div className={"leftContainerItem" + ((tabNum == 2) ? " highlight" : "")} onClick={() => setTabNum(2)}>
        <div className="highlightBar" />
        <InfoIcon />
        <div>info</div>
      </div>

    </div>
    <div id="rightContainer" >
      <div hidden={tabNum !== 0}>
        <div className="rightContainerTitle">通用设置</div>
        <BoolItem icon={<AdsClickIcon />} mainText="启用点击穿透" description="聊天框点击不穿透; 模型 hitArea 缺失会导致穿透面积增大; 点击穿透后无法拖动窗口 (待修复) " type="bool" callback={ (val) => {setEnableClickThrough(val); window.api.setStore("enableClickThrough", val); window.api.setEnableClickThrough(val) }} content={enableClickThrough} />

        <BoolItem icon={<WalletIcon />} mainText="发送图片时节省 token" description="开启后发送图片时不发送历史聊天图片" type="bool" callback={(val) => { setTokenSaveMode(val); window.api.setStore("tokenSaveMode", val) }} content={tokenSaveMode} />

        {/* <TextFieldItem icon={<KeyIcon />} mainText="API Key" description="API Key 用于访问 GPT-SoVits 服务" type="input" callback={(val) => { }} content={apiKey} /> */}

        <TextFieldItem icon={<KeyIcon />} mainText="API Key" description="API Key 用于访问大语言模型" type="input" callback={(val) => { setApikey(val); window.api.setStore("apikey", val) }} content={apikey} />

        <LongTextFieldItem icon={<KeyIcon />} mainText="prompt" description="prompt 用于指定人物形象性格" type="input" callback={(val) => { setPrompt(val); window.api.setStore("prompt", val) }} content={prompt} />

        {/* <div className="rightContainerItem">ok<br /> sometext</div> */}
      </div>

      <div hidden={tabNum !== 1}>
        <div className="rightContainerTitle">隐私</div>
        <BoolItem icon={<ChatBubbleIcon />} mainText="启用主动对话" description="启用后 AI 会不定时主动发起对话，可能会消耗更多 token" type="bool" callback={() => { setActiveChat((val)=>{!val}) }} content={activeChat} />
      </div>

      <div hidden={tabNum !== 2}>
        <div className="rightContainerTitle">信息</div>
        <div> Serika 是一款基于 live2d 的桌宠项目。配合 GPT-SoVits 使用 api.py 启动的后台服务程序体验更佳。</div>
        {/* <div>Serika Enchance 包括文字转语音等功能，您也可以自定义语音转文字服务 api 路径</div> */}
        <br></br>
        <div>项目地址：<a href="https://github.com/rouVling/serika">https://github.com/rouVling/serika</a></div>
      </div>

    </div>
  </div>
}
