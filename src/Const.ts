export const BASE_URL = "https://localhost:8443/api";
export const BASE_BOOKS_APIS = `${BASE_URL}/books`;
export const BASE_REVIEWS_APIS = `${BASE_URL}/reviews`;
export const REVIEW_BY_USER = `${BASE_REVIEWS_APIS}/secure/user/book?bookId=`;
export const CURRENT_USER_LOANS_COUNT = `${BASE_BOOKS_APIS}/secure/current-loans/count`;
export const CHECKED_OUT_BY_USER = `${BASE_BOOKS_APIS}/secure/checked-out/by-user?bookId=`;
export const CHECK_OUT_BOOK = `${BASE_BOOKS_APIS}/secure/checkout?bookId=`;
export const REVIEW_SUBMIT = `${BASE_REVIEWS_APIS}/secure`;