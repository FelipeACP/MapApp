import React from 'react';

export default function Instruction() {
  return (
    <div className="instructionDiv">
      <button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">
        Instructions
      </button>
      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <img className="instructionImg" src="https://i.imgur.com/O96Y7Ce.png" alt="instructions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
