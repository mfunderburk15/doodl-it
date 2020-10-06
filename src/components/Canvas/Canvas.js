import React, { Component } from "react";

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = null;
    this.context = null;
    this.mounted = false;
    this.mouse = {
      click: false,
      move: false,
      pos: { x: 0, y: 0 },
      pos_prev: false,
    };
    this.width = 4;
    this.color = "#000000";
    this.lines = [];

    this.state = {
      ctx: null,
    };
  }
}
