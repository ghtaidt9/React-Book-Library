import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";

export const Histories = () => {
  const { authState } = useOktaAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);

  //Histories
  const [histories, setHistories] = useState<HistoryModel[]>([]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchHistories = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `https://localhost:8443/api/histories/search/findBooksByUserEmail?userEmail=${
          authState.accessToken?.claims.sub
        }&page=${currentPage - 1}&size=5`;
        const reqOpts = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(url, reqOpts);
        if (!response.ok) throw new Error("Something went wrong!");

        const resJson = await response.json();
        setHistories(resJson._embedded.histories);
        setTotalPages(resJson.page.totalPages);
      }
      setIsLoading(false);
    };
    fetchHistories().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [authState, currentPage]);

  if (isLoading) return <SpinnerLoading />;
  if (httpError)
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {histories.length > 0 ? (
        <>
          <h5>Recent history: </h5>
          {histories.map((history) => (
            <div key={history.id}>
              <div className="card -mt-3 shadow p-3 mb-3 bg-body rounded">
                <div className="row g-0">
                  <div className="col-md-2">
                    <div className="d-none d-lg-block">
                      <img
                        width={123}
                        height={196}
                        alt="Book"
                        src={
                          history.img
                            ? history.img
                            : require("./../../../Images/BooksImages/book-luv2code-1000.png")
                        }
                      />
                    </div>
                    <div className="d-lg-none d-flex justirfy-content-center align-items-center">
                      <img
                        width={123}
                        height={196}
                        alt="Book"
                        src={
                          history.img
                            ? history.img
                            : require("./../../../Images/BooksImages/book-luv2code-1000.png")
                        }
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="card-body">
                      <h5 className="card-title"> {history.author}</h5>
                      <h4> {history.title}</h4>
                      <p className="card-text">{history.description}</p>
                      <hr />
                      <p className="card-text">
                        Checked out on: {history.chekoutDate}
                      </p>
                      <p className="card-text">
                        Returned on: {history.returnDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </>
      ) : (
        <>
          <h3 className="mt-3">Currently no history: </h3>
          <Link className="btn btn-primary" to={"search"}>
            Search for new book
          </Link>
        </>
      )}
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          paginate={paginate}
        />
      )}
    </div>
  );
};
