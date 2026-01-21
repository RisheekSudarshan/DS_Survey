import { Routes, Route } from "react-router-dom";
import Intro from "./components/Intro";
import Survey from "./components/Survey";
import End from "./components/End";
import React from "react";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Intro/>} />
      <Route path="/survey" element={<Survey/>} />
      <Route path="/end" element={<End/>} />
    </Routes>
  );
}