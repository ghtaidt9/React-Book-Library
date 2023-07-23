import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

export const AdminMessages = () => {
  const { authState } = useOktaAuth();

  // Normal Loading Pieces
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Messages endpoint state
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);

  // Pagination'
  const [currentPage, setCurrenPage] = useState(1);
  const [totalPags, setTotalPages] = useState(0);

  // Recall useEffect
  const [btnSubmit, setBtnSubmit] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `https://localhost:8443/api/messages/search/findByClosed?closed=false&page=${
          currentPage - 1
        }&size=${messagesPerPage}`;

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

        const resJson = await response.json();
        setMessages(resJson._embedded.messages);
        setTotalPages(resJson.page.totalPags);
      }
      setIsLoading(false);
    };

    fetchMessages().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [authState, currentPage, btnSubmit, messagesPerPage]);

  if (isLoading) return <SpinnerLoading />;

  if (httpError)
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );

  const paginate = (pageNumber: number) => setCurrenPage(pageNumber);

  const submitResToQuestion = async (id: number, response: string) => {
    const url = `https://localhost:8443/api/messages/secure/admin/message`;
    if (
      authState &&
      authState?.isAuthenticated &&
      id !== null &&
      response !== ""
    ) {
      const messageAdminReqModel: AdminMessageRequest = new AdminMessageRequest(
        id,
        response
      );
      const reqOpts = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageAdminReqModel),
      };
      const reqRes = await fetch(url, reqOpts);

      if (!reqRes.ok) {
        throw new Error("Something went wrong!");
      }

      setBtnSubmit(!btnSubmit);
    }
  };

  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <AdminMessage
              message={message}
              key={message.id}
              submitResponse={submitResToQuestion}
            />
          ))}
        </>
      ) : (
        <h5>No pending Q/A</h5>
      )}
      {totalPags > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPags}
          paginate={paginate}
        />
      )}
    </div>
  );
};
