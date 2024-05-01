import React, { Component } from "react";
import { SubredditList } from "./SubredditList";
import {PageHeader} from "./PageHeader";
import {Pagination} from "./Pagination";
import './css/table.css';
import './css/page.css';
import { isRecord, parseSubredditInfo } from "./record";
import { SubredditInfo } from "./data/subredditInfo";

const DEBUG : boolean = true;

type PageState = {
  // 0-based indexing
  pageNumber: bigint;
  itemsPerPage: bigint;
  firstItemNumber: bigint;
  items: SubredditInfo[] | undefined;
}

export class App extends Component<{}, PageState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      pageNumber: 0n,
      itemsPerPage : 25n,
      firstItemNumber: 1n,
      items : undefined,
    };
  }
  
  render = (): JSX.Element => {
    return (
    <div className="pageContainer">
      <Pagination itemsPerPage={this.state.itemsPerPage} pageNumber={this.state.pageNumber} changePageClick={this.doChangePageClickCallback}/>
      <PageHeader doItemsPerPageClick={(itemsPerPage) => this.doItemsPerPageClick(itemsPerPage)}/>
      <SubredditList pageNumber={this.state.pageNumber} itemsPerPage={this.state.itemsPerPage} items={this.state.items} firstItemNumber={this.state.firstItemNumber}/> 
    </div>)
  };

  componentDidMount = (): void =>{
    this.doRefreshClick(this.state.itemsPerPage, this.state.pageNumber, this.state.firstItemNumber);
  }

  doItemsPerPageClick = (itemsPerPage: bigint): void => {
    if(DEBUG) console.log(`App.doItemsPerPageClick`);

    if(this.state.itemsPerPage !== itemsPerPage){
      if(DEBUG) console.log(`App.doItemsPerPageClick -> itemsPerPage set: ${itemsPerPage}`);

      if(this.state.itemsPerPage < itemsPerPage){
        this.doRefreshClick(itemsPerPage, this.state.pageNumber, this.state.firstItemNumber);
      }else{
        this.setState({itemsPerPage});
      }
    }
  }

  doChangePageClickCallback = (pageNumber: bigint): void => {
    if(pageNumber < 0n){
      return;
    }

    if(this.state.pageNumber === pageNumber){
      return;
    }

    const diff: bigint = this.state.pageNumber - pageNumber;
    const newFirstItemNumber = this.state.firstItemNumber + (this.state.itemsPerPage * diff);

    this.doChangePageClick(pageNumber, newFirstItemNumber);
  }

  doChangePageClick = (pageNumber: bigint, firstItemNumber: bigint): void => {
    if(DEBUG) console.log(`App.doChangePageClick:${pageNumber}`);
    this.doRefreshClick(this.state.itemsPerPage, pageNumber, firstItemNumber + this.state.itemsPerPage);
  }

  doRefreshClick = (itemsPerPage: bigint, pageNumber: bigint, firstItemNumber: bigint): void => {
    const args = {itemsPerPage: Number(itemsPerPage), pageNumber: Number(pageNumber), firstItemNumber: Number(firstItemNumber)};
    fetch("/api/getSubredditInfos", {
      method: "POST", body: JSON.stringify(args),
      headers: {"Content-Type": "application/json"} })
    .then(this.doGetResp)
    .catch(() => this.doGetError("failed to connect to server"));
  }

  doGetResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doGetJson)
          .catch(() => this.doGetError("200 res is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doGetError)
          .catch(() => this.doGetError("400 response is not text"));
    } else {
      this.doGetError(`bad status code from /api/refersh: ${res.status}`);
    }
  };

  doGetJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/getSubredditInfos: not a record", data);
      return;
    }

    if(data.items == undefined){
      console.error("bad data from /api/getSubredditInfos: data not returned", data.items);
      return;
    }
    
    const items : SubredditInfo[] | undefined = parseSubredditInfo(data);
    const itemsPerPage = data.itemsPerPage
    const pageNumber = data.pageNumber;
    const firstItemNumber = data.firstItemNumber;
    if(items === undefined){
      console.error("bad data from /api/getSubredditInfos: returned data was malformatted", data);
      return;
    }

    if(pageNumber === undefined){
      console.error("bad data from /api/getSubredditInfos: returned data was malformatted", pageNumber);
      return;
    }else if(typeof pageNumber !== 'number'){
      console.error("bad data from /api/getSubredditInfos: returned data was malformatted", pageNumber);
      return;
    }

    if(itemsPerPage === undefined){
      console.error("bad data from /api/getSubredditInfos: returned data was malformatted", itemsPerPage);
      return;
    }else if(typeof itemsPerPage !== 'number'){
      console.error("bad data from /api/getSubredditInfos: returned data was malformatted", itemsPerPage);
      return;
    }

    if(firstItemNumber === undefined){
      console.error("bad data from /api/getSubredditInfos: returned data was malformatted", firstItemNumber);
      return;
    }else if(typeof firstItemNumber !== 'number'){
      console.error("bad data from /api/getSubredditInfos: returned data was malformatted", firstItemNumber);
      return;
    }
    
    this.setState({items, pageNumber: BigInt(pageNumber), itemsPerPage: BigInt(itemsPerPage), firstItemNumber: BigInt(firstItemNumber)});
  }

  doGetError = (msg: string): void => {
    console.error(`Error fetching /api/refresh: ${msg}`);
  };
}