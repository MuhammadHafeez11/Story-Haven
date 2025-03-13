import { ALL_BOOKS_REQUEST,
    ALL_BOOKS_SUCCESS, 
    ALL_BOOKS_FAIL, 
    CLEAR_ERRORS
 } from "../constants/bookConstant";

export const getBooks = () => async (dispatch) => {
    try{
        dispatch({type : ALL_PRODUCT_REQUEST});

        let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

        if(category){
          link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
        }
        const {data} = await axios.get(link);

        dispatch({ type:ALL_PRODUCT_SUCCESS, payload: data})
    }catch(error){
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: error.response.data.message,
        })
    }
}
