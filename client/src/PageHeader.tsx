import React, { Component } from "react";

const DEBUG: boolean = true;

type PageHeaderProps = {
  doItemsPerPageClick: (itemsPerPage: bigint) => void;
}

export class PageHeader extends Component<PageHeaderProps, {}> {

  constructor(props: PageHeaderProps) {
    super(props);
  }

  render = (): JSX.Element => {
    return (
      <div>
        <select name="pets" id="pet-select" onChange={(evt) => this.setItemsPerPageClick(BigInt(evt.target.value))}>
          <option value="">Items per page</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    );
  }

  setItemsPerPageClick = (itemsPerPage: bigint): void => {
    if (DEBUG) console.log(`PageHeader.doItemsPerPageClick ${itemsPerPage}`);
    this.props.doItemsPerPageClick(itemsPerPage);
  }
}