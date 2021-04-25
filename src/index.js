import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ImageViewer from "./ImageViewer";
import {BrowserRouter as Router} from "react-router-dom";


import 'typeface-roboto';

ReactDOM.render(
    <Router>
        <ImageViewer/>
    </Router>,
    document.getElementById('root')
);
