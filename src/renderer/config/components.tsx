import React from "react";

export interface ConfigItemProps {
  icon: React.JSX.Element;
  mainText: string;
  description: string;
  type: "bool" | "selection" | "input";
  callback: (value: any) => void;
  content: any;
}

interface TextItemPartProps {
  icon: React.JSX.Element;
  mainText: string;
  description: string;
}

export function TextItemPart(props: TextItemPartProps) {
  return <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    {props.icon}
    <div className="textItemContainer">
      <div className="textItemPart">
        {props.mainText}
      </div>
      <div className="textItemPart description">
        {props.description}
      </div>
    </div>
  </div>
}

export function BoolItem(props: ConfigItemProps) {
  return <div className="rightContainerItem">
    <TextItemPart icon={props.icon} mainText={props.mainText} description={props.description} />
    <div style={{width: "50px", height: "50px", paddingRight: "60px"}} onClick={() => { props.callback(!props.content)}}>
      <label className="toggle">
        <input type="checkbox" hidden checked={props.content} />
        <div data-off="关闭" data-on="开启">Notification</div>
      </label>
    </div>
  </div>
}

export function TextFieldItem(props: ConfigItemProps) {
  return <div className="rightContainerItem">
    <TextItemPart icon={props.icon} mainText={props.mainText} description={props.description} />
    <input type="text" value={props.content} onChange={(e) => props.callback(e.target.value)} />
  </div>
}

export function LongTextFieldItem(props: ConfigItemProps) {
  return <div className="rightContainerItem" style={{flexWrap: "wrap", height: "auto"}}>
    <TextItemPart icon={props.icon} mainText={props.mainText} description={props.description} />
    <textarea type="text" value={props.content} onChange={(e) => props.callback(e.target.value)} />
  </div>
}