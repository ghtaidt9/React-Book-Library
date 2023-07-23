import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";

export const LoanModal: React.FC<{
  shelfCurrentLoan: ShelfCurrentLoans;
  mobile: boolean;
  returnBook: any;
  renewLoan: any;
}> = (props) => {
  return (
    <div
      className="modal fade"
      id={`${props.mobile ? "mobile" : ""}modal${
        props.shelfCurrentLoan.book.id
      }`}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      key={props.shelfCurrentLoan.book.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Loan Options
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    {
                      <img
                        src={
                          props.shelfCurrentLoan.book?.img ||
                          require("./../../../Images/BooksImages/book-luv2code-1000.png")
                        }
                        width={56}
                        height={87}
                        alt="Book"
                      />
                    }
                  </div>
                  <div className="col-10">
                    <h6>{props.shelfCurrentLoan.book.author}</h6>
                    <h4>{props.shelfCurrentLoan.book.title}</h4>
                  </div>
                </div>
                <hr />
                {props.shelfCurrentLoan.daysLeft > 0 && (
                  <p className="text-secondary">
                    Due in {props.shelfCurrentLoan.daysLeft} days.
                  </p>
                )}
                {props.shelfCurrentLoan.daysLeft === 0 && (
                  <p className="test-success">Due Today.</p>
                )}
                {props.shelfCurrentLoan.daysLeft < 0 && (
                  <p className="text-danger">
                    Past due by {props.shelfCurrentLoan.daysLeft} days.
                  </p>
                )}
                <div className="list-group mt-3">
                  <button
                    data-bs-dismiss="modal"
                    className="list-group-item list-group-item-action"
                    aria-current="true"
                    onClick={() =>
                      props.returnBook(props.shelfCurrentLoan.book.id)
                    }
                  >
                    Return Book
                  </button>
                  <button
                    data-bs-dismiss="modal"
                    className={`list-group-item list-group-item-action ${
                      props.shelfCurrentLoan.daysLeft < 0 ? "inactiveLink" : ""
                    }`}
                    onClick={
                      props.shelfCurrentLoan.daysLeft < 0
                        ? (event) => event.preventDefault()
                        : () => props.renewLoan(props.shelfCurrentLoan.book.id)
                    }
                  >
                    {props.shelfCurrentLoan.daysLeft < 0
                      ? "Late dues cannot be renewed"
                      : "Renew loan for 7 days"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};