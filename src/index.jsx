import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter, RouterProvider, Routes, Route, NavLink, useParams,
} from 'react-router-dom';
import './style.scss';

function Nav(props) {
  return (
    <nav>
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/test/id1">test id1</NavLink></li>
        <li><NavLink to="/test/id2">test id2</NavLink></li>
      </ul>
    </nav>
  );
}

function About(props) {
  return <div> All there is to know about me </div>;
}
function Welcome(props) {
  return <div>Welcome</div>;
}

function Test(props) {
  const { id } = useParams();
  return <div> ID: {id} </div>;
}

function FallBack(props) {
  return <div>URL Not Found</div>;
}

function Root() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/about" element={<About />} />
        <Route path="/test/:id" element={<Test />} />
        <Route path="*" element={<FallBack />} />
      </Routes>
    </div>
  );
}
const router = createBrowserRouter([
  { path: '*', Component: Root },
]);
function App(props) {
  return <RouterProvider router={router} />;
}

const root = createRoot(document.getElementById('main'));
root.render(<App />);
