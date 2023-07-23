import { useOktaAuth } from "@okta/okta-react";
import MessageModel from "../../../models/MessageModel";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";

export const Messages = () => {
  const { authState } = useOktaAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpErro] = useState(null);

  // Messages
  const [messages, setMessages] = useState<MessageModel[]>([]);

  //Pagination
  const [messagePerpage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `https://localhost:8443/api/messages/search/findByUserEmail?userEmail=${
          authState.accessToken?.claims.sub
        }&page=${currentPage - 1}&size=${messagePerpage}`;
        const reqOpts = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, reqOpts);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const responeJson = await response.json();
        setMessages(responeJson._embedded.messages);
        setTotalPages(responeJson.page.totalPages);
      }
      setIsLoading(false);
    };

    fetchMessages().catch((error) => {
      setIsLoading(false);
      setHttpErro(error.message);
    });
    window.scrollTo(0, 0);
  }, [authState, currentPage, messagePerpage]);

  if (isLoading) return <SpinnerLoading />;

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A: </h5>
          {messages.map((message) => (
            <div key={message.id}>
              <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                  Case #{message.id}: {message.title}
                </h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr />
                <div>
                  <h5>Response: </h5>
                  {message.response && message.adminEmail ? (
                    <>
                      <h6>{message.adminEmail}</h6>
                      <p>{message.response}</p>
                    </>
                  ) : (
                    <>
                      <p>
                        <i>
                          Pending response from administration, Please be
                          patient.
                        </i>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <h5>All questions you submit will be show here</h5>
        </>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
