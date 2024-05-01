import React, { Component } from "react";
import './css/pagination.css';


const DEBUG : boolean = true;

type PaginationProps = {
  itemsPerPage: bigint
  pageNumber: bigint;
  changePageClick : (pageNumber: bigint) => void;
}

export class Pagination extends Component<PaginationProps, {}>{
  constructor(props: PaginationProps){
    super(props);
  }

  render = (): JSX.Element =>{
    if(DEBUG) console.log(`Pagination.render()`);
    return this.renderButtons();
  }

  renderButtons = (): JSX.Element => {
    const buttons = [];

    buttons.push(<button 
      className="pagination-button" onClick={() => this.props.changePageClick(this.props.pageNumber - 1n)} key={"previous"}>Previous</button>) 

    if(this.props.pageNumber <= 5){
      for(let i : bigint = 0n; i < 5n; i++){
        buttons.push(
          <button className="pagination-button"
          onClick={() => this.props.changePageClick(i)} key={Number(i)}>{Number(i + 1n)}</button>
        )
      }
    }else{
      buttons.push(<button className="pagination-button"
        onClick={() => this.props.changePageClick(0n)} key={"firstPage"}>{Number(1n)}</button>)

      for(let i : bigint = this.props.pageNumber; i <= this.props.pageNumber + 4n; i++){
          buttons.push(
            <button className="pagination-button"
             onClick={() => this.props.changePageClick(i - 1n)} key={Number(i * 37n)}>{Number(i)}</button>
          )
      }
    }
  
    buttons.push(<button className="pagination-button" onClick={() => this.props.changePageClick(this.props.pageNumber + 1n)} key={"Next"}>Next</button>)    

    return (
      <div className="pagination-container">
        <div className="pagination-box">
          {buttons}
        </div>
      </div>
    );
  }
}