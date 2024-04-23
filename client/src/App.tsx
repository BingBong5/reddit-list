import React, { Component } from "react";
import { SubredditList } from "./SubredditList";
import {PageHeader} from "./PageHeader";
import './css/table.css';
import './css/page.css';

const DEBUG : boolean = true;

type PageState = {
  // 0-based indexing
  page: bigint;
  itemsPerPage: bigint;
}

/** Displays the UI of the Flashcard application. */
export class App extends Component<{}, PageState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      page: 0n,
      itemsPerPage : 25n
    };
  }
  
  render = (): JSX.Element => {
    return (
    <div className="pageContainer">
      <PageHeader doItemsPerPageClick={(itemsPerPage) => this.doItemsPerPageClick(itemsPerPage)}/>
      <SubredditList pageNumber={this.state.page} itemsPerPage={this.state.itemsPerPage} /> 
    </div>)
    ;
  };

  doItemsPerPageClick = (itemsPerPage: bigint): void => {
    if(DEBUG) console.log(`App.doItemsPerPageClick ${itemsPerPage}`);
    this.setState({itemsPerPage});
  }
}


// type FlashcardAppState = {
//   name: string;  // mirror state of name input box
//   msg: string;   // essage sent from server
// }


// /** Displays the UI of the Flashcard application. */
// export class FlashcardApp extends Component<{}, FlashcardAppState> {

//   constructor(props: {}) {
//     super(props);

//     this.state = {name: "", msg: ""};
//   }
  
//   render = (): JSX.Element => {
//     return (<div>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input type="text" id="name" value={this.state.name}
//                  onChange={this.doNameChange}></input>
//           <button onClick={this.doDummyClick}>Dummy</button>
//         </div>
//         {this.renderMessage()}
//       </div>);
//   };

//   renderMessage = (): JSX.Element => {
//     if (this.state.msg === "") {
//       return <div></div>;
//     } else {
//       return <p>Server says: {this.state.msg}</p>;
//     }
//   };

//   doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
//     this.setState({name: evt.target.value, msg: ""});
//   };

//   doDummyClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
//     const name = this.state.name.trim();
//     if (name.length > 0) {
//       const url = "/api/dummy?name=" + encodeURIComponent(name);
//       fetch(url).then(this.doDummyResp)
//           .catch(() => this.doDummyError("failed to connect to server"));
//     }
//   };

//   doDummyResp = (res: Response): void => {
//     if (res.status === 200) {
//       res.json().then(this.doDummyJson)
//           .catch(() => this.doDummyError("200 response is not JSON"));
//     } else if (res.status === 400) {
//       res.text().then(this.doDummyError)
//           .catch(() => this.doDummyError("400 response is not text"));
//     } else {
//       this.doDummyError(`bad stauts code ${res.status}`);
//     }
//   };

//   doDummyJson = (data: unknown): void => {
//     if (!isRecord(data)) {
//       console.error("200 response is not a record", data);
//       return;
//     }

//     if (typeof data.msg !== "string") {
//       console.error("'msg' field of 200 response is not a string", data.msg);
//       return;
//     }

//     this.setState({msg: data.msg});
//   }

//   doDummyError = (msg: string): void => {
//     console.error(`Error fetching /api/dummy: ${msg}`);
//   };

// }