import { Col } from "antd";
import React from "react";
import './style.css';
export default function GridField(props){

  let showColon = props.colon === undefined ? true : props.colon;
  let childs = props.children instanceof Array ? props.children : [ props.children ];

  return (
    <Col className="gridfield-col" {...props}>
      { props.label && !!props.label.length ? <label className="gridfield-label">{props.label}{ showColon && ':'}</label> : false}
       <div class="gridfield-content">{childs}</div>
    </Col>
  )
}
