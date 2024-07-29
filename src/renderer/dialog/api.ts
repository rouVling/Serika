import { Google } from "@mui/icons-material"
import { DialogMessage, GeminiResponse } from "./types"
// import { GoogleGenerativeAI } from "@google/generative-ai"

export function getVoiceUsingModelscope(inputText): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket("wss://www.modelscope.cn/api/v1/studio/xzjosh/Azuma-GPT-SoVITS/gradio/queue/join?backend_url=%2Fapi%2Fv1%2Fstudio%2Fxzjosh%2FAzuma-GPT-SoVITS%2Fgradio%2F")
    if (ws === null) {
      return null
    }

    ws.onopen = () => {
      console.log("connected")
    }

    ws.onclose = () => {
      console.log("closed")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)
      if (data.msg === "send_hash") {
        ws.send(JSON.stringify({ "fn_index": 0, "session_hash": "yus74unu0fs" }))
      }
      if (data.msg === "send_data") {
        const a = {
          "data":
            ["完了我找不到他之前的投稿了，反正就是有一个。", "完了我找不到他之前的投稿了，反正就是有一个。", "中文", inputText, "中文", "不切"],
          "event_data": null, "fn_index": 1, "dataType": ["dropdown", "textbox", "dropdown", "textbox", "dropdown", "radio"],
          "session_hash": "yus74unu0fs"
        }
        ws.send(JSON.stringify(a))
      }

      if (data.msg === "process_completed") {
        // setVoiceUrl(data.output.data[0].name)
        ws.close()
        if (data.success) {
          // resolve(data.output.data[0].name)
          fetch("https://www.modelscope.cn/api/v1/studio/xzjosh/Azuma-GPT-SoVITS/gradio/file=" + data.output.data[0].name).then((res) => {
            resolve(res.url)
          }).catch((err) => {
            reject(err)
          })
        }
        else {
          reject("error")
        }
      }
    }
  })
}


export function getVoiceLocal(inputText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    resolve("http://localhost:9880?text=" + inputText + "&text_language=zh")
  })
}

export function getVoiceOTTO(inputText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest()
    xhttp.open("POST", "http://api.otto.nandgate.top/make", false)
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhttp.onreadystatechange = function () {
      if (JSON.parse(xhttp.responseText).code == 400) {
        reject("error in generating voice")
      } else {
        resolve("http://api.otto.nandgate.top/get/" + JSON.parse(xhttp.responseText).id + ".wav")
      }
    }
    xhttp.onerror = function () {
      reject("error")
    }
    xhttp.send("text=" + inputText + "&inYsddMode=true&norm=true&reverse=false&speedMult=1&pitchMult=1")
  })
}

export function getResponseGPT(msgs: DialogMessage[], api_key: string, prompt?: string, saveTokenMode: boolean = true): Promise<string> {

  const contents = prompt ? [{ content: prompt, role: "user" }, ...msgs] : msgs

  return new Promise((resolve, reject) => {
    fetch("https://api.openai-sb.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + api_key
      },
      body: JSON.stringify({
        // "model": "gpt-3.5-turbo",
        "model": "gpt-4o-mini",
        "messages": contents.map((message) => {
          return {
            role: message.role,
            content: (message as DialogMessage).img ? (
              ((saveTokenMode && message === contents[contents.length - 1]) || !saveTokenMode) ?
                [{ type: "text", text: message.content }, { type: "image_url", image_url: { url: "data:image/jpeg;base64," + (message as DialogMessage).img } }] :
                [{ type: "text", text: message.content }]
            ) : [{ type: "text", text: message.content }]
          }
        }),
        "temperature": 0.5,
      })
    }).then((res) => {
      res.json().then((data) => {
        resolve(data.choices[0].message.content)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function getResponseGemini(msgs: DialogMessage[], api_key: string, prompt?: string, saveTokenMode: boolean = true): Promise<string> {
  return new Promise((resolve, reject) => {

    const contents = prompt ? [{ content: prompt, role: "user" }, ...msgs] : msgs

    fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent" + "?key=" + api_key, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: contents.map((message, index) => {
          return {
            role: (() => {
              switch (message.role) {
                case "user":
                  return "user"
                case "assistant":
                  return "model"
                default:
                  return "user"
              }
            })(),
            parts: (message as DialogMessage).img ? (
              ((saveTokenMode && index === contents.length - 1) || !saveTokenMode) ? [{ text: message.content }, { inlineData: { mimeType: "image/png", data: (message as DialogMessage).img } }] : [{ text: message.content }]
            ) : [{ text: message.content }]
          }
        })

      })
    }).then((res) => {
      res.json().then((data: GeminiResponse) => {
        resolve(data.candidates[0].content.parts[0].text)
      })
    }).catch((err) => {
      reject(err)
    })
  })
}

// export function getResponseGemini(msgs: DialogMessage[], api_key: string, prompt?: string): Promise<string> {
//   const genAI = new GoogleGenerativeAI(api_key)
//   const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})

//   return new Promise((resolve, reject) => {

//   })
// }