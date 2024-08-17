import React, { useEffect, useState } from "react"
import { BoolItem, TextFieldItem, TextItemPart, LongTextFieldItem, SelectItem, TextWithButtonItem } from "./components";

import KeyIcon from '@mui/icons-material/Key';
import InfoIcon from '@mui/icons-material/Info';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SecurityIcon from '@mui/icons-material/Security';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SettingsIcon from '@mui/icons-material/Settings';
import WalletIcon from '@mui/icons-material/Wallet';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NotesIcon from '@mui/icons-material/Notes';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import { NestCamWiredStandTwoTone } from "@mui/icons-material";
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SaveIcon from '@mui/icons-material/Save';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';

interface expressionConfig {
  name: string,
  explaination: string
}

interface motionConfig {
  group: string,
  name: string[],
}



export default function App() {

  const [activeChat, setActiveChat] = useState(false) // 未对接
  const [model, setModel] = useState("Gemini-pro")
  const [apikey, setApikey] = useState("")
  const [enableClickThrough, setEnableClickThrough] = useState(false)
  const [tokenSaveMode, setTokenSaveMode] = useState(true)
  const [prompt, setPrompt] = useState("")
  const [modelPath, setModelPath] = useState("")
  const [modelName, setModelName] = useState("")
  const [saveOnDelete, setSaveOnDelete] = useState(false)

  const [tabNum, setTabNum] = useState(0)

  const [modelDesc, setModelDesc] = useState("")
  const [modelExpressionConfig, setModelExpressionConfig] = useState<expressionConfig[]>([])
  const [modelMotionConfig, setModelMotionConfig] = useState<motionConfig[]>([])

  const [styleName, setStyleName] = useState("default")

  const [lappAdapter, setLappAdapter] = useState(undefined)

  // const [on, setOn] = useState(false)


  useEffect(() => {
    window.api.getStore("apikey").then((value: string) => {
      setApikey(value ? value : "")
    })
  }, [])

  useEffect(() => {
    window.api.getStore("tokenSaveMode").then((value: boolean) => {
      setTokenSaveMode(value === undefined ? true : value)
    })
  }, [])

  useEffect(() => {
    window.api.getStore("enableClickThrough").then((value: boolean) => {
      setEnableClickThrough(value === undefined ? false : value)
    })
  }, [])

  useEffect(() => {
    window.api.getStore("prompt").then((value: string) => {
      setPrompt(value ? value : "")
    })
  }, [])

  useEffect(() => {
    window.api.getStore("model").then((value: string) => {
      setModel(value ? value : "Gemini")
    })
  }, [])

  useEffect(() => {
    window.api.getStore("modelPath").then((value: string) => {
      setModelPath(value ? value : "")
    })
  }, [])

  useEffect(() => {
    window.api.getStore("modelName").then((value: string) => {
      setModelName(value ? value : "")
    })
  }, [])

  useEffect(() => {
    window.api.getStore("saveOnDelete").then((value: boolean) => {
      setSaveOnDelete(value ? value : false)
    })
  }, [])

  useEffect(() => {
    window.api.getStore("styleName").then((value: string) => {
      setStyleName(value ? value : "default")
    })
  }, [])

  useEffect(() => {
    window.api.getStore(modelName + ".desc").then((value) => {
      if (value === undefined) {
        setModelDesc("")
      } else {
        setModelDesc(value)
      }
    })
  }, [modelName])

  useEffect(() => {
    window.api.onModelValueReceived((value: any) => {
      console.log("config/App.tsx useEffect onModelValueReceived value: ", value)
      switch (value.name.body.name) {
        case "exps":
          let expConfig = value.value.map((expName) => {
            return { name: expName, explaination: "" }
          })
          for (let i = 0; i < expConfig.length; i++) {
            for (let j = 0; j < modelExpressionConfig.length; j++) {
              if (expConfig[i].name == modelExpressionConfig[j].name) {
                expConfig[i].explaination = modelExpressionConfig[j].explaination
              }
            }
          }
          setModelExpressionConfig(expConfig)
          break
        case "motions":
          let temp = value.value.map((item) => {
            return { group: item.group, name: (new Array(item.num)).fill("") }
          })

          setModelMotionConfig(temp)
          break
        default:
          break
      }
    })

    return () => {
      window.api.requestModel({ method: "debug", body: "return of useEffect onModelValueReceived" })
      window.api.onModelValueReceived(() => { })
    }
  }, [modelExpressionConfig, modelMotionConfig])

  useEffect(() => {
    if (modelName === "") return
    window.api.getStore(modelName + ".exps").then((value) => {
      if (value === undefined) {
        window.api.requestModel(
          {
            method: "get",
            body: { name: "exps" }
          }
        )
      } else {
        console.log("config/App.tsx useEffect getStore(modelName): setModelExpressionConfig: ", value)
        setModelExpressionConfig(() => value)
      }
    })
  }, [modelName])

  useEffect(() => {
    if (modelName === "") return
    window.api.getStore(modelName + ".motions").then((value) => {
      if (value === undefined) {
        window.api.requestModel(
          {
            method: "get",
            body: { name: "motions" }
          }
        )
      }
      else {
        console.log("config/App.tsx useEffect getStore(modelName): setModelMotionConfig: ", value)
        setModelMotionConfig(() => value)
      }
    })

  }, [modelName])

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
        <EmojiPeopleIcon />
        <div>Model</div>
      </div>

      <div className={"leftContainerItem" + ((tabNum == 3) ? " highlight" : "")} onClick={() => setTabNum(3)}>
        <div className="highlightBar" />
        <InfoIcon />
        <div>info</div>
      </div>

    </div>
    <div id="rightContainer" >
      <div hidden={tabNum !== 0}>
        <div className="rightContainerTitle">通用设置</div>
        <BoolItem icon={<AdsClickIcon />} mainText="启用点击穿透" description="聊天框点击不穿透; 模型 hitArea 缺失会导致穿透面积增大; 点击穿透后无法拖动窗口 (待修复) " type="bool" callback={(val) => { setEnableClickThrough(val); window.api.setStore("enableClickThrough", val); window.api.setEnableClickThrough(val) }} content={enableClickThrough} />

        <BoolItem icon={<WalletIcon />} mainText="发送图片时节省 token" description="开启后发送图片时不发送历史聊天图片" type="bool" callback={(val) => { setTokenSaveMode(val); window.api.setStore("tokenSaveMode", val) }} content={tokenSaveMode} />

        {/* <TextFieldItem icon={<KeyIcon />} mainText="API Key" description="API Key 用于访问 GPT-SoVits 服务" type="input" callback={(val) => { }} content={apiKey} /> */}

        <SelectItem icon={<SwapHorizIcon />} mainText="风格" description="选择界面风格" type="selection" callback={(val) => { setStyleName(val); window.api.setStore("styleName", val) }} content={{ default: styleName, options: ["default", "fluent"] }} />

        <SelectItem icon={<SwapHorizIcon />} mainText="模型" description="选择使用的模型" type="selection" callback={(val) => { setModel(val) }} content={{ default: model, options: ["GPT-4o-mini", "Gemini"] }} />

        <TextFieldItem icon={<KeyIcon />} mainText="API Key" description="API Key 用于访问大语言模型" type="input" callback={(val) => { setApikey(val); window.api.setStore("apikey", val) }} content={apikey} />

        <LongTextFieldItem icon={<NotesIcon />} mainText="prompt" description="prompt 用于提示模型回复" type="input" callback={(val) => { setPrompt(val); window.api.setStore("prompt", val) }} content={prompt} />

        <TextWithButtonItem icon={<FolderIcon />} mainText="live2d 模型库文件夹" description="存放 live2d 模型的文件夹路径" type="input" callback={(val) => { setModelPath(val); window.api.setStore("modelPath", val) }} content={{
          value: modelPath, buttonText: "选择文件夹", action: () => {
            window.api.openFolder().then((value: string) => {
              setModelPath(() => { return value })
              window.api.setStore("modelPath", value)
            })
          }
        }} />

        <TextWithButtonItem icon={<PersonIcon />} mainText="live2d 模型名" description="模型文件夹名称，一般一个模型为一个文件夹" type="input" callback={(val) => { setModelName(val); window.api.setStore("modelName", val) }} content={{
          value: modelName, buttonText: "应用", action: () => {
            // LAppAdapter.getInstance().setChara(modelPath, modelName)
            window.api.setChara(modelPath, modelName)
          }
        }} />


      </div>

      <div hidden={tabNum !== 1}>
        <div className="rightContainerTitle">隐私</div>
        <BoolItem icon={<ChatBubbleIcon />} mainText="启用主动对话" description="启用后 AI 会不定时主动发起对话，可能会消耗更多 token" type="bool" callback={() => { setActiveChat((val) => { !val }) }} content={activeChat} />
        <BoolItem icon={<SaveIcon />} mainText="保存对话摘要" description="会增加 token 消耗" type="bool" callback={(val) => { setSaveOnDelete(val); window.api.setStore("saveOnDelete", val); }} content={saveOnDelete} />
      </div>

      <div hidden={tabNum !== 2}>
        <div className="rightContainerTitle">模型适配</div>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px" }}>
          <div style={{ fontSize: "24px" }}>
            基础信息
          </div>
        </div>
        <LongTextFieldItem icon={<NotesIcon />} mainText="character" description="模型的描述" type="input" callback={(val) => { setModelDesc(val); window.api.setStore(modelName + ".desc", val); window.api.requestModel({ method: "post", body: { command: "setModelDesc", value: val}}) }} content={modelDesc} />

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px", marginTop: "20px" }}>
          <div style={{ fontSize: "24px" }}>
            表情
          </div>
          <div>
            <button
              style={{
                backgroundColor: "#3c3c3c",
                color: "white",
                marginRight: "20px",
                border: "1px solid #303030",
                borderRadius: "5px",
                height: "100%"
              }}
              onClick={() => {
                window.api.requestModel(
                  {
                    method: "get",
                    body: { name: "exps" }
                  }
                )
              }}>刷新</button>
            {/* <button
              style={{
                backgroundColor: "#3c3c3c",
                color: "white",
                marginRight: "20px",
                border: "1px solid #303030",
                borderRadius: "5px",
                height: "100%"
              }}
              onClick={() => {
                // window.api.setStore(modelName, undefined)
                // window.api.setStore(modelName, [])
                window.api.deleteStore(modelName)
                setModelExpressionConfig([])
              }}>清空</button> */}
          </div>
        </div>

        {
          modelExpressionConfig.map((config, index) => {
            return <TextWithButtonItem
              key={index}
              icon={<EmojiEmotionsIcon />}
              mainText={config.name}
              description={""}
              type="input"
              callback={
                (val) => {
                  setModelExpressionConfig(
                    [...modelExpressionConfig.slice(0, index),
                    { name: config.name, explaination: val },
                    ...modelExpressionConfig.slice(index + 1)]
                  )

                  const newModelExpressionConfig = [...modelExpressionConfig.slice(0, index),
                  { name: config.name, explaination: val },
                  ...modelExpressionConfig.slice(index + 1)]

                  window.api.setStore(modelName + ".exps", newModelExpressionConfig)

                  window.api.requestModel({
                    method: "post",
                    body: {
                      command: "setExpressionDesc",
                      value: newModelExpressionConfig
                    }
                  })
                }
              }
              content={{
                value: config.explaination,
                buttonText: "测试",
                action: () => {
                  window.api.requestModel({
                    method: "post",
                    body: {
                      command: "setExpression",
                      value: config.name
                    }
                  })
                }
              }} />
          })
        }
        {
          (modelExpressionConfig.length === 0) && <div>该模型没有内置表情</div>
        }

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px", marginTop: "20px" }}>
          <div style={{ fontSize: "24px" }}>
            动作
          </div>
          <div>
            <button
              style={{
                backgroundColor: "#3c3c3c",
                color: "white",
                marginRight: "20px",
                border: "1px solid #303030",
                borderRadius: "5px",
                height: "100%"
              }}
              onClick={() => {
                window.api.requestModel(
                  {
                    method: "get",
                    body: { name: "motions" }
                  }
                )
              }}>重置</button>
          </div>
        </div>
        {
          (modelExpressionConfig.length === 0) && <div>该模型没有内置表情</div>
        }
        {
          modelMotionConfig.map((config, groupIndex) => {
            return <>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px", marginTop: "20px" }}>
                <div>动作组：{config.group}</div>
              </div>

              {
                config.name.map((motion, index) => {
                  return <TextWithButtonItem
                    key={index}
                    icon={<AccessibleForwardIcon />}
                    mainText={index.toString()}
                    description=""
                    type="input"
                    callback={(val) => {
                      const newConfig = (
                        [
                          ...modelMotionConfig.slice(0, groupIndex),
                          {
                            group: config.group,
                            name: [...config.name.slice(0, index), val, ...config.name.slice(index + 1)]
                          },
                          ...modelMotionConfig.slice(groupIndex + 1)
                        ]
                      )
                      setModelMotionConfig(newConfig)
                      window.api.setStore(modelName + ".motions", newConfig)
                      window.api.requestModel({
                        method: "post",
                        body: {
                          command: "setMotionDesc",
                          value: newConfig
                        }
                      })
                    }}
                    content={{
                      value: motion,
                      buttonText: "测试",
                      action: () => {
                        window.api.requestModel({
                          method: "post",
                          body: {
                            command: "setMotion",
                            value: { group: config.group, num: index }
                          }
                        })
                      }
                    }}
                  />
                })
              }
            </>
          })
        }
      </div>

      <div hidden={tabNum !== 3}>
        <div className="rightContainerTitle">信息</div>
        <div> Serika 是一款基于 live2d 的桌宠项目。配合 GPT-SoVits 使用 api.py 启动的后台服务程序体验更佳。</div>
        {/* <div>Serika Enchance 包括文字转语音等功能，您也可以自定义语音转文字服务 api 路径</div> */}
        <br></br>
        <div>项目地址：<a href="https://github.com/rouVling/serika">https://github.com/rouVling/serika</a></div>
      </div>

    </div>
  </div>
}
