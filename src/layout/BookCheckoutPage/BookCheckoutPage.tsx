import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import {
  BASE_BOOKS_APIS,
  BASE_REVIEWS_APIS,
  CHECKED_OUT_BY_USER,
  CHECK_OUT_BOOK,
  CURRENT_USER_LOANS_COUNT,
  REVIEW_BY_USER,
  REVIEW_SUBMIT,
} from "../../Const";
import { LatestReview } from "./LatestReview";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review state
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStar, setTotalStar] = useState(0);
  const [isReviewLeft, setIsReviewLeft] = useState(false);

  // Loans count state
  const [currentLoansCount, setCurrentLoansCount] = useState(0);

  // Is Book Check out
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  // Payment
  const [displayError, setDisplayError] = useState(false);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      const baseUrl: string = `${BASE_BOOKS_APIS}/${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) throw new Error("Something went wrong!");
      if (response.ok) setIsLoading(false);

      const responseJson = await response.json();

      const loadedBooks: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setBook(loadedBooks);
    };

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [bookId, isCheckedOut]);

  useEffect(() => {
    const fetchBookReview = async () => {
      setIsLoading(true);
      const reviewUrl: string = `${BASE_REVIEWS_APIS}/search/findByBookId?bookId=${bookId}`;
      const responseReviews = await fetch(reviewUrl);
      if (!responseReviews.ok) {
        setIsLoading(false);
        throw new Error("Something went wrong!");
      }

      if (responseReviews.ok) setIsLoading(false);

      const responseJsonReviews = await responseReviews.json();
      const responseData = responseJsonReviews._embedded.reviews;
      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          bookId: responseData[key].bookId,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews += responseData[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStar(Number(round));
      }
      setReviews(loadedReviews);
    };

    fetchBookReview().catch((error: any) => {
      setHttpError(error);
    });
  }, [bookId, isCheckedOut, isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${REVIEW_BY_USER.concat(bookId)}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error("Something went wrong");
        }

        const userReviewSponseJson = await userReview.json();
        setIsReviewLeft(userReviewSponseJson);
      }
    };
    fetchUserReviewBook().catch((error) => {
      setHttpError(error.message);
    });
  }, [authState, bookId]);

  useEffect(() => {
    const fetchUserCurrentLoandsCount = async () => {
      setIsLoading(true);
      if (authState && authState?.isAuthenticated) {
        const url = CURRENT_USER_LOANS_COUNT;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          setIsLoading(false);
          throw new Error("Something went wrong!");
        }

        if (currentLoansCountResponse.ok) setIsLoading(false);

        const currentLoansCountResponseJson =
          await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson);
      }
    };

    fetchUserCurrentLoandsCount().catch((error: any) => {
      setHttpError(error.message);
    });
  }, [authState, bookId, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState?.isAuthenticated) {
        const url = `${CHECKED_OUT_BY_USER.concat(bookId)}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const responseJson = await response.json();
        setIsCheckedOut(responseJson);
      }
    };
    fetchUserCheckedOutBook().catch((error: any) => {
      setHttpError(error.message);
    });
  }, [authState, bookId, isCheckedOut]);

  if (isLoading) return <SpinnerLoading />;

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const checkoutBook = async () => {
    const url = `${CHECK_OUT_BOOK.concat(bookId)}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      setDisplayError(true);
      return;
      // throw new Error("Something went wrong!");
    }
    setDisplayError(false);
    setIsCheckedOut(true);
  };

  const submitReview = async (starInput: number, reviewDescription: string) => {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }
    const revRqModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );
    const url = `${REVIEW_SUBMIT}`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(revRqModel),
    };
    const res = await fetch(url, requestOptions);
    if (!res.ok) {
      throw new Error("Something went wrong.");
    }

    setIsReviewLeft(true);
  };

  return (
    <div>
      <div className="container d-none d-lg-block">
        {displayError && (
          <div className="alert alert-danger mt-3" role="alert">
            Please pay outstanding fees and/or return late book(s).
          </div>
        )}
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStar} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReview reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        {displayError && (
          <div className="alert alert-danger mt-3" role="alert">
            Please pay outstanding fees and/or return late book(s).
          </div>
        )}
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStar} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReview reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
