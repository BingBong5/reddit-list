import React, { Component } from "react";
import { SubredditInfo } from "./data/subredditInfo";
import { SubredditTable } from "./SubredditTable";
import { ITEMS } from './data/subredditInfo'

type SubredditListProps = {
  page: bigint,
  itemsPerPage: bigint,
}

type SubredditListState = {
  items: SubredditInfo[] | undefined;
}

export class SubredditList extends Component<SubredditListProps, SubredditListState> {
  constructor(props: SubredditListProps) {
    super(props);

    this.state = { items: ITEMS };
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
            page={this.props.page}
            itemsPerPage={this.props.itemsPerPage} />
        </div>
      )
    }
  }

  doGetSubredditInfo = (itemsPerPage: bigint): void => {
    itemsPerPage;
  }
}