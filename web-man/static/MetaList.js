import React, { Component } from "react";

/*
{"sha256":"C28C3EDC10494AD4A5E0D235240A51883B58E416F2724C74668A85A31AB79D19",
"paths":["/Users/Zach/Desktop/BdayPresent/Bobsburgerswithdog.png"],
"extensions":["PNG"],
"earliestDate":1529762242949,
"storedAt":"C/2/C28C3EDC10494AD4A5E0D235240A51883B58E416F2724C74668A85A31AB79D19.PNG"}
*/

export default class MetaList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const list = this.props.list;
    const name = this.props.name;
    const result = list.map((val, idx) =>
      <li key={name + idx}>
        {val}
      </li>
    );

    return <ul>{result}</ul>
  }
}