import React, { useEffect, useState } from "react"
import { BoolItem, TextFieldItem, TextItemPart } from "./components";
import Store from 'electron-store'

import KeyIcon from '@mui/icons-material/Key';
import InfoIcon from '@mui/icons-material/Info';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SecurityIcon from '@mui/icons-material/Security';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

export default function App() {

  // const store = new Store()

  // const [apiKey, setApiKey] = useState(store.get("apiKey") || "")

  const [activeChat, setActiveChat] = useState(false)
  const [apikey, setApikey] = useState("")

  const [tabNum, setTabNum] = useState(0)
  const [on, setOn] = useState(false)

  useEffect(() => {
    window.api.getStore("apikey").then((value: string) => {
      setApikey(value? value : "")
    })
  }, [])

  return <div id="totalContainer">
    <div id="leftContainer">

      <div className={"leftContainerItem" + ((tabNum == 0) ? " highlight" : "")} onClick={() => setTabNum(0)}>
        <div className="highlightBar" />
        <KeyIcon />
        <div>api_key</div>
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
        <div className="rightContainerTitle">API 设置</div>
        {/* <BoolItem icon={<RecordVoiceOverIcon />} mainText="启用本地部署的 GPT-SoVits" description="本地部署 GPT-SoVits 后可以离线进行语音合成" type="bool" callback={() => { setOn((val) => { !val }) }} content={on} /> */}

        {/* <TextFieldItem icon={<KeyIcon />} mainText="API Key" description="API Key 用于访问 GPT-SoVits 服务" type="input" callback={(val) => { }} content={apiKey} /> */}

        <TextFieldItem icon={<KeyIcon />} mainText="API Key" description="API Key 用于访问大语言模型" type="input" callback={(val) => { setApikey(val); window.api.setStore("apikey", val) }} content={apikey} />

        {/* <div className="rightContainerItem">ok<br /> sometext</div> */}
      </div>
      <div hidden={tabNum !== 1}>
        <div className="rightContainerTitle">信息</div>
        <div> Serika 是一款基于 live2d 的桌宠项目。配合 GPT-SoVits 使用 api.py 启动的后台服务程序体验更佳。</div>
        {/* <div>Serika Enchance 包括文字转语音等功能，您也可以自定义语音转文字服务 api 路径</div> */}
        <br></br>
        <div>项目地址：<a href="https://github.com/rouVling/serika">https://github.com/rouVling/serika</a></div>
      </div>

      <div hidden={tabNum !== 2}>
        <div className="rightContainerTitle">隐私</div>
        <BoolItem icon={<ChatBubbleIcon />} mainText="启用主动对话" description="启用后 AI 会不定时主动发起对话，可能会消耗更多 token" type="bool" callback={() => { setActiveChat((val)=>{!val}) }} content={activeChat} />
      </div>
    </div>
  </div>
}
