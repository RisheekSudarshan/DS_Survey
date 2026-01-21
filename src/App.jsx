import { Routes, Route } from "react-router-dom";
import Intro from "./components/Intro";
import Survey from "./components/Survey";
import End from "./components/End";
import TrapRedirect from "./components/TrapRedirect";
import TrapLink from "./components/TrapLink";
import TrapRedirect8 from "./components/TrapRedirect8";
import TrapRedirect14 from "./components/TrapRedirect14";
import TrapRedirect16 from "./components/TrapRedirect16";
import TrapLink12 from "./components/TrapLink12";
import React from "react";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Intro/>} />
      <Route path="/survey" element={<Survey/>} />
      <Route path="/end" element={<End/>} />
      <Route path="/trap/redirect" element={<TrapRedirect/>} />
      <Route path="/trap/redirect/8" element={<TrapRedirect8/>} />
      <Route path="/trap/redirect/14" element={<TrapRedirect14/>} />
      <Route path="/trap/redirect/16" element={<TrapRedirect16/>} />
      <Route path="/trap/link" element={<TrapLink/>} />
      <Route path="/trap/link/12" element={<TrapLink12/>} />
    </Routes>
  );
}