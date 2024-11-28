"use client";
import React, { useEffect, useState } from "react";

import "./Loader.css";
import { setColor } from "../../utils/projectColors";


export default function Loader({ boxed, type, primaryColor, secondaryColor, backgroundColor, props, scale=null, sx = {} }) {
  const [LoaderClass, setLoaderClass] = useState("trigger");

  if (props !== undefined) {
    boxed = props.boxed;
    type = props.type;
    primaryColor = props.primaryColor;
    secondaryColor = props.secondaryColor;
    backgroundColor = props.backgroundColor;
    scale = props.scale;
  }

  useEffect(() => {
    if (type === "squares") {
      setLoaderClass("flip-to-square");
    }
    else if (type === "dots-line") {
      setLoaderClass("mexican-wave");
    }
    else if (type === "dots-flow") {
      setLoaderClass("dots-flow");
    }
    else if (type === "trigger") {
      setLoaderClass("trigger");
    }
    else if (type === "basic") {
      setLoaderClass("basic");
      
    } else if (type === "square-of-dots") {
      setLoaderClass("square-of-dots");
    }
  }, [type]);

  if (scale !== null ) {
    sx = {
      ...sx,
      transform: `scale(${scale})`
    }
  }

  useEffect(() => {
    if (primaryColor !== undefined){
      document.documentElement.style.setProperty('--primaryL', primaryColor);
      setColor(primaryColor, "primaryL")
    }
    if (secondaryColor !== undefined){
      document.documentElement.style.setProperty('--secondaryL', secondaryColor);
      setColor(secondaryColor, "secondaryL")
    }
    if (backgroundColor !== undefined){
      document.documentElement.style.setProperty('--bg-color-L', backgroundColor);
    }
  }, [primaryColor, secondaryColor, backgroundColor]);

  return (
    <div className={`Loader-FS ${boxed? "boxed": ""}`} style={sx}>
      <div className={`loader ${LoaderClass}`}>
        {LoaderClass === "flip-to-square"? Array.from({ length: 9 }).map((_, index) => (
          <div key={index}/>
        ))
        :
        null
        }
      </div>
    </div>
  );
}