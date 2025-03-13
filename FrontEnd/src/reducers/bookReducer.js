import { ALL_BOOKS_REQUEST,
    ALL_BOOKS_SUCCESS, 
    ALL_BOOKS_FAIL, 
    CLEAR_ERRORS
 } from "../constants/bookConstant";


export const bookReducer = (state = { books: [] }, action) => {
    switch (action.type) {
        case ALL_BOOKS_REQUEST:
            return {
                loading: true,
                books: [],
            }
        case ALL_BOOKS_SUCCESS:
            return {
                loading: false,
                books: action.payload.books,
                // productsCount: action.payload.productsCount,
                // resultPerPage: action.payload.resultPerPage,
                // filteredProductsCount: action.payload.filteredProductsCount,
            }
        case ALL_BOOKS_FAIL:
            return {
                loading: false,
                error: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            }
        default:
            return state;
    }
}
