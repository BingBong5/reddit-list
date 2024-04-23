import React, { Component } from "react";
import { SubredditInfo } from "./data/subredditInfo";
import { SubredditTable } from "./SubredditTable";
import { isRecord, parseSubredditInfo} from "./record";

const DEBUG : boolean = true;

type SubredditListProps = {
  pageNumber: bigint,
  itemsPerPage: bigint,
}

type SubredditListState = {
  items: SubredditInfo[] | undefined;
}

export class SubredditList extends Component<SubredditListProps, SubredditListState> {
  constructor(props: SubredditListProps) {
    super(props);

    this.state = { items: undefined };
  }

  render = (): JSX.Element => {
    if (this.state.items === undefined) {
      return <></>
      // TODO ************************
      // return the loading animation thing
    } else {
      return (
        <div className="subredditTableContainer">
          <SubredditTable
            items={this.state.items}
            page={this.props.pageNumber}
            itemsPerPage={this.props.itemsPerPage} />
        </div>
      )
    }
  }

  componentDidMount = (): void => {
    if(DEBUG) console.log("SubredditList.componentDidMount")
    this.doRefreshClick(this.props.itemsPerPage, this.props.pageNumber);
  }

  componentDidUpdate = (prevProps: SubredditListProps): void => {
    if(DEBUG) console.log(`SubredditList.componentDidUpdate: prevProps.itemsPerPage:${prevProps.itemsPerPage} prevProps.pageNumber:${prevProps.pageNumber}`);
    
    if(prevProps.itemsPerPage !== this.props.itemsPerPage || prevProps.pageNumber !== this.props.pageNumber){
      if(DEBUG) console.log(`componendDidUpdate: initiate fetch calls`);
      this.doRefreshClick(this.props.itemsPerPage, this.props.pageNumber);
    }
  }

  doRefreshClick = (itemsPerPage: bigint, pageNumber: bigint): void => {
    const args = {itemsPerPage: Number(itemsPerPage), pageNumber: Number(pageNumber)};
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
    if(items == undefined){
      console.error("bad data from /api/getSubredditInfos: returned data was malformatted", data);
      return;
    }
    this.setState({items});
  }

  doGetError = (msg: string): void => {
    console.error(`Error fetching /api/refresh: ${msg}`);
  };
}